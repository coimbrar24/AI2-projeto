const { getTeam, searchTeams } = require('../services/teamService');

const search = async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();

    if (query.length < 2) {
      const error = new Error('A pesquisa deve ter pelo menos 2 caracteres.');
      error.statusCode = 400;
      throw error;
    }

    const teams = await searchTeams(query);

    return res.status(200).json({
      query,
      count: teams.length,
      teams,
    });
  } catch (error) {
    return next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const teamId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(teamId) || teamId < 1) {
      const error = new Error('Identificador de equipa inválido.');
      error.statusCode = 400;
      throw error;
    }

    const team = await getTeam(teamId);
    return res.status(200).json({ team });
  } catch (error) {
    return next(error);
  }
};

module.exports = { search, show };
