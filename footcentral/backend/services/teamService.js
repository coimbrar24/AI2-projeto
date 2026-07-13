const { env } = require('../config/env');
const { fetchFootballData } = require('./footballService');

const TEAM_LIST_CACHE_TTL = 60 * 60 * 1000;
const TEAM_CACHE_TTL = 10 * 60 * 1000;

const normalize = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-PT');

const searchTeams = async (query, limit = 12) => {
  const pages = await Promise.all(
    [0, 500].map((offset) =>
      fetchFootballData(
        `${env.footballApi.baseUrl}/teams?limit=500&offset=${offset}`,
        TEAM_LIST_CACHE_TTL
      )
    )
  );
  const teams = pages.flatMap((page) => page.teams || []);
  const normalizedQuery = normalize(query);

  return teams
    .filter((team) =>
      [team.name, team.shortName, team.tla, team.area?.name].some((value) =>
        normalize(value).includes(normalizedQuery)
      )
    )
    .sort((first, second) => {
      const firstName = normalize(first.shortName || first.name);
      const secondName = normalize(second.shortName || second.name);
      const firstStartsWith = firstName.startsWith(normalizedQuery) ? 0 : 1;
      const secondStartsWith = secondName.startsWith(normalizedQuery) ? 0 : 1;

      return firstStartsWith - secondStartsWith || firstName.localeCompare(secondName);
    })
    .slice(0, limit)
    .map((team) => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crest: team.crest,
      area: team.area,
      founded: team.founded,
      venue: team.venue,
      clubColors: team.clubColors,
    }));
};

const getTeam = async (teamId) => {
  const now = new Date();
  const season =
    now.getUTCMonth() < 7 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
  const team = await fetchFootballData(
    `${env.footballApi.baseUrl}/teams/${teamId}?season=${season}`,
    TEAM_CACHE_TTL
  );

  return { ...team, season };
};

module.exports = { getTeam, searchTeams };
