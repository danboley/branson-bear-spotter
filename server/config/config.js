require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

module.exports = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    dialect: "postgres",
  },
  production: {
    url: databaseUrl,
    dialect: "postgres",
  },
};

const sequelize = require('./config/database');
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((error) => console.error('Database connection error:', error));
