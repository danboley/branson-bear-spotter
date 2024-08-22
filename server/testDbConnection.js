const { Client } = require("pg");

const client = new Client({
  user: "dblocal",
  host: "localhost",
  database: "branson_db_dev",
  password: "dblocal",
  port: 5432,
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
