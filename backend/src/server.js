const app = require('./app');
const { connectDb, mongoose } = require('./config/db');
const env = require('./config/env');

let server;

connectDb()
  .then(() => {
    server = app.listen(env.port, () => {
      console.log(`TaskFlow API running on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  });

const shutdown = async () => {
  await mongoose.connection.close();
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
