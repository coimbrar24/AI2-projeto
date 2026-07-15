const { Sequelize } = require("sequelize");
const { env } = require("./env");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});


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