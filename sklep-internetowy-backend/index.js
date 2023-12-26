const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
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
app.use(express.json());
app.use(bodyParser.json());

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

async function sprawdzTypUzytkownika(idUzytkownika) {
  try {
    const clientResult = await pool.query(
      "SELECT * FROM klienci WHERE id_uzytkownika = $1",
      [idUzytkownika]
    );
    if (clientResult.rowCount > 0) {
      return "CLIENT";
    }

    const employeeResult = await pool.query(
      "SELECT * FROM pracownicy WHERE id_uzytkownika = $1",
      [idUzytkownika]
    );
    if (employeeResult.rowCount > 0) {
      return "EMPLOYEE";
    }

    return "UNAUTHORIZED";
  } catch (error) {
    console.error("Błąd przy sprawdzaniu typu użytkownika:", error);
    throw error;
  }
}

app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const result = await pool.query(
      `SELECT logowanie($1,$2) AS id_uzytkownika`,
      [login, password]
    );
    const idUzytkownika = result.rows[0].id_uzytkownika;

    if (idUzytkownika) {
      const typUzytkownika = await sprawdzTypUzytkownika(idUzytkownika);
      res.json({
        success: true,
        idUzytkownika,
        typUzytkownika,
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Błędne dane logowania" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
