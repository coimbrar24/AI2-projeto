const favoriteService = require('../services/favoriteService');

const index = async (req, res, next) => {
  try {
    const favorites = await favoriteService.listFavorites(req.user.id);
    return res.status(200).json(favorites);
  } catch (error) {
    return next(error);
  }
};

const store = async (req, res, next) => {
  try {
    const { favorite, created } = await favoriteService.saveFavorite(
      req.user.id,
      req.body
    );

    return res.status(created ? 201 : 200).json({ favorite });
  } catch (error) {
    return next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    await favoriteService.removeFavorite(
      req.user.id,
      req.params.type,
      req.params.externalId
    );
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = { destroy, index, store };
