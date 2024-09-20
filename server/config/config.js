require("dotenv").config();

const { DATABASE_URL } = process.env;

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
    use_env_variable: DATABASE_URL,
    dialect: "postgres",
  },
};
