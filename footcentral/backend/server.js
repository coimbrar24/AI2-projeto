const app = require('./app');
const { env } = require('./config/env');
const { connectDatabase, syncDatabase } = require('./config/database');

require('./models');

const startServer = async () => {
  try {
    await connectDatabase();
    await syncDatabase();

    app.listen(env.port, () => {
      console.log(`FootCentral API running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start FootCentral API:', error.message);
    process.exit(1);
  }
};

startServer();
