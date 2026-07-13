const { Favorite } = require('../models');

const VALID_TYPES = new Set(['team', 'match']);

const text = (value, maxLength = 200) =>
  typeof value === 'string' ? value.slice(0, maxLength) : null;

const teamSummary = (team, externalId) => ({
  id: externalId,
  name: text(team?.name),
  shortName: text(team?.shortName),
  tla: text(team?.tla, 5),
  crest: text(team?.crest, 500),
  founded: Number.isInteger(team?.founded) ? team.founded : null,
  venue: text(team?.venue),
  area: team?.area
    ? {
        name: text(team.area.name),
        code: text(team.area.code, 5),
        flag: text(team.area.flag, 500),
      }
    : null,
});

const matchSummary = (match, externalId) => ({
  id: externalId,
  utcDate: text(match?.utcDate, 40),
  status: text(match?.status, 30),
  result: text(match?.result, 20),
  area: match?.area
    ? { name: text(match.area.name), code: text(match.area.code, 5) }
    : null,
  competition: match?.competition
    ? {
        id: Number(match.competition.id) || null,
        name: text(match.competition.name),
        code: text(match.competition.code, 10),
        emblem: text(match.competition.emblem, 500),
      }
    : null,
  homeTeam: teamSummary(match?.homeTeam, Number(match?.homeTeam?.id) || 0),
  awayTeam: teamSummary(match?.awayTeam, Number(match?.awayTeam?.id) || 0),
  score: {
    fullTime: {
      home: Number.isInteger(match?.score?.fullTime?.home)
        ? match.score.fullTime.home
        : null,
      away: Number.isInteger(match?.score?.fullTime?.away)
        ? match.score.fullTime.away
        : null,
    },
  },
});

const validateFavorite = ({ type, externalId, data }) => {
  if (!VALID_TYPES.has(type)) {
    const error = new Error('O tipo de favorito deve ser team ou match.');
    error.statusCode = 400;
    throw error;
  }

  const parsedId = Number(externalId);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    const error = new Error('O identificador do favorito é inválido.');
    error.statusCode = 400;
    throw error;
  }

  return {
    type,
    externalId: parsedId,
    data:
      type === 'team'
        ? teamSummary(data, parsedId)
        : matchSummary(data, parsedId),
  };
};

const listFavorites = async (userId) => {
  const favorites = await Favorite.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  return {
    teams: favorites.filter((favorite) => favorite.type === 'team'),
    matches: favorites.filter((favorite) => favorite.type === 'match'),
  };
};

const saveFavorite = async (userId, payload) => {
  const favoriteData = validateFavorite(payload);
  const [favorite, created] = await Favorite.findOrCreate({
    where: {
      userId,
      type: favoriteData.type,
      externalId: favoriteData.externalId,
    },
    defaults: {
      userId,
      ...favoriteData,
    },
  });

  if (!created) {
    await favorite.update({ data: favoriteData.data });
  }

  return { favorite, created };
};

const removeFavorite = async (userId, type, externalId) => {
  const favoriteData = validateFavorite({ type, externalId, data: {} });
  const deleted = await Favorite.destroy({
    where: {
      userId,
      type: favoriteData.type,
      externalId: favoriteData.externalId,
    },
  });

  if (!deleted) {
    const error = new Error('Favorito não encontrado.');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = { listFavorites, removeFavorite, saveFavorite };
