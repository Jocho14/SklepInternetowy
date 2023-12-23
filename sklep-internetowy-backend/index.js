const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = express();
app.use(cors());

app.get("/produkty", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produkty");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/produkty/:nazwa/rozmiary", async (req, res) => {
  try {
    const nazwaProduktu = req.params.nazwa;
    const result = await pool.query(
      `SELECT r.rozmiar FROM produkty p JOIN rozmiary r ON p.id_rozmiaru = r.id_rozmiaru WHERE p.nazwa = $1`,
      [nazwaProduktu]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
