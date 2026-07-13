const User = require('./User');
const Favorite = require('./Favorite');

User.hasMany(Favorite, {
  as: 'favorites',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Favorite.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
});

module.exports = {
  Favorite,
  User,
};
