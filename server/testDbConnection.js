require("dotenv").config();

const { Client } = require("pg");

// const client = new Client({
//   user: "dblocal",
//   host: "localhost",
//   database: "branson_db_dev",
//   password: "dblocal",
//   port: 5432,
// });

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client
  .connect()
  .then(() => {
    console.log("Connected to the database successfully.");
    return client.end();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
