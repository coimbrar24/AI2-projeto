const {
  getFinishedMatches,
  getMatches: fetchMatches,
} = require('../services/footballService');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const formatDate = (date) => date.toISOString().slice(0, 10);

const getDefaultDates = () => {
  const dateTo = new Date();
  dateTo.setUTCDate(dateTo.getUTCDate() + 1);

  const dateFrom = new Date(dateTo);
  dateFrom.setUTCDate(dateFrom.getUTCDate() - 10);

  return {
    dateFrom: formatDate(dateFrom),
    dateTo: formatDate(dateTo),
  };
};

const validateDate = (date) => {
  if (!DATE_PATTERN.test(date)) {
    const error = new Error('As datas devem estar no formato YYYY-MM-DD.');
    error.statusCode = 400;
    throw error;
  }
};

const getLimit = (value, fallback = 10) => {
  const requestedLimit = Number.parseInt(value, 10);

  return Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 50)
    : fallback;
};

const getMatches = async (req, res, next) => {
  try {
    const date = req.query.date || formatDate(new Date());
    validateDate(date);

    const dateTo = new Date(`${date}T00:00:00Z`);
    dateTo.setUTCDate(dateTo.getUTCDate() + 1);

    const matches = await fetchMatches({
      dateFrom: date,
      dateTo: formatDate(dateTo),
      limit: getLimit(req.query.limit, 50),
    });

    return res.status(200).json({
      date,
      count: matches.length,
      matches,
    });
  } catch (error) {
    return next(error);
  }
};

const getResults = async (req, res, next) => {
  try {
    const defaultDates = getDefaultDates();
    const dateFrom = req.query.dateFrom || defaultDates.dateFrom;
    const dateTo = req.query.dateTo || defaultDates.dateTo;
    const limit = getLimit(req.query.limit);

    validateDate(dateFrom);
    validateDate(dateTo);

    if (dateFrom > dateTo) {
      const error = new Error('A data inicial não pode ser posterior à data final.');
      error.statusCode = 400;
      throw error;
    }

    const periodInDays =
      (Date.parse(`${dateTo}T00:00:00Z`) -
        Date.parse(`${dateFrom}T00:00:00Z`)) /
      DAY_IN_MS;

    if (periodInDays > 10) {
      const error = new Error('O intervalo de pesquisa não pode exceder 10 dias.');
      error.statusCode = 400;
      throw error;
    }

    const matches = await getFinishedMatches({ dateFrom, dateTo, limit });

    return res.status(200).json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMatches, getResults };
