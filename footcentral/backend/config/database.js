const { Sequelize } = require('sequelize');
const { env } = require('./env');

const sequelize = new Sequelize(
  env.database.name,
  env.database.user,
  env.database.password,
  {
    host: env.database.host,
    port: Number(env.database.port),
    dialect: 'postgres',
    logging: env.nodeEnv === 'development' ? console.log : false,

    dialectOptions:
      env.nodeEnv === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  }
);

const connectDatabase = async () => {
  await sequelize.authenticate();
  console.log('PostgreSQL connection established successfully.');
};

const syncDatabase = async () => {
  await sequelize.sync({
    alter: env.nodeEnv === 'development',
  });

  console.log('Database models synchronized successfully.');
};

module.exports = {
  sequelize,
  connectDatabase,
  syncDatabase,
};