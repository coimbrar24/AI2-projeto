const { env } = require('../config/env');

const CACHE_TTL = 60 * 1000;
const responseCache = new Map();
const pendingRequests = new Map();

const buildApiError = (status, payload) => {
  const error = new Error(
    payload?.message || 'Não foi possível obter os resultados dos jogos.'
  );
  error.statusCode = status >= 400 && status < 500 ? status : 502;
  return error;
};

const fetchFootballData = async (url, cacheTtl = CACHE_TTL) => {
  const cached = responseCache.get(url);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  if (pendingRequests.has(url)) {
    return pendingRequests.get(url);
  }

  const request = (async () => {
    let response;

    try {
      response = await fetch(url, {
        headers: {
          'X-Auth-Token': env.footballApi.key,
        },
      });
    } catch {
      const error = new Error('A API de futebol não está disponível.');
      error.statusCode = 502;
      throw error;
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw buildApiError(response.status, payload);
    }

    responseCache.set(url, {
      payload,
      expiresAt: Date.now() + cacheTtl,
    });

    return payload;
  })();

  pendingRequests.set(url, request);

  try {
    return await request;
  } finally {
    pendingRequests.delete(url);
  }
};

const getMatches = async ({ dateFrom, dateTo, limit, status }) => {
  if (!env.footballApi.key) {
    const error = new Error('A chave da API de futebol não está configurada.');
    error.statusCode = 503;
    throw error;
  }

  const params = new URLSearchParams({ dateFrom, dateTo });

  if (status) {
    params.set('status', status);
  }

  const payload = await fetchFootballData(
    `${env.footballApi.baseUrl}/matches?${params}`
  );

  return (payload.matches || [])
    .sort((first, second) =>
      status === 'FINISHED'
        ? new Date(second.utcDate) - new Date(first.utcDate)
        : new Date(first.utcDate) - new Date(second.utcDate)
    )
    .slice(0, limit)
    .map((match) => ({
      id: match.id,
      utcDate: match.utcDate,
      status: match.status,
      area: match.area,
      competition: match.competition,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      score: match.score,
      result: `${match.score?.fullTime?.home ?? '-'} - ${
        match.score?.fullTime?.away ?? '-'
      }`,
    }));
};

const getFinishedMatches = (options) =>
  getMatches({ ...options, status: 'FINISHED' });

module.exports = { fetchFootballData, getFinishedMatches, getMatches };
