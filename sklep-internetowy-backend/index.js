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
app.use(
  cors({
    origin: "http://localhost:5173", // Adres frontendu
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

const session = require("express-session");
app.use(
  session({
    secret: "mojtajnyklucz",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 1000,
      secure: false,
    },
  })
);

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

app.get("/size/:nazwa/rozmiary", async (req, res) => {
  try {
    const nazwaRozmiaru = req.params.nazwa;
    const result = await pool.query(
      `SELECT id_rozmiaru FROM rozmiary WHERE rozmiar = $1`,
      [nazwaRozmiaru]
    );
    res.json(result.rows[0].id_rozmiaru);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const result = await pool.query(
      `SELECT logowanie($1,$2) AS id_uzytkownika`,
      [login, password]
    );
    const userId = result.rows[0].id_uzytkownika;
    const userType = await sprawdzTypUzytkownika(userId);

    if (userId) {
      const userDetails = await getUserDetails(userId);
      req.session.user = { id: userId, type: userType, name: userDetails.name };
      req.session.save();

      console.log("creating session user", req.session.user);

      res.json({ success: true, name: userDetails.name });
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

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Błąd serwera podczas wylogowywania");
    } else {
      res.status(200).json({ message: "Wylogowano pomyślnie" });
    }
  });
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

app.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});

async function getUserDetails(userId) {
  try {
    const result = await pool.query(
      "SELECT imie, nazwisko FROM uzytkownicy WHERE id_uzytkownika = $1",
      [userId]
    );

    if (result.rows.length > 0) {
      return {
        name: result.rows[0].imie,
        surname: result.rows[0].nazwisko,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Błąd przy pobieraniu danych użytkownika:", error);
    throw error;
  }
}

app.post("/get-or-create-order", async (req, res) => {
  console.log("create-order1: ", req.session);
  console.log("create-order2 user: ", req.session.user);

  if (!req.session.user) {
    console.log("user not logged in");
    return res.status(403).send("Użytkownik nie jest zalogowany.");
  }

  const userId = req.session.user.id;

  try {
    const existingOrder = await pool.query(
      "SELECT * FROM zamowienia WHERE id_klienta = $1 AND data_zlozenia_zamowienia IS NULL",
      [userId]
    );

    if (existingOrder.rows.length === 0) {
      const newOrder = await pool.query("SELECT stworz_zamowienie($1)", [
        userId,
      ]);

      req.session.orderId = newOrder.rows[0].id_zamowienia;
      res.json(newOrder.rows[0]);
    } else {
      req.session.orderId = existingOrder.rows[0].id_zamowienia;
      res.json(existingOrder.rows[0]);
    }
    req.session.save();
    console.log("order: ", req.session.orderId);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/add-product-to-order", async (req, res) => {
  console.log("add-product-to-oder-user: ", req.session.user);
  console.log("add-product-to-oder-orderId: ", req.session.orderId);
  if (!req.session.user || !req.session.orderId) {
    return res
      .status(403)
      .send("Użytkownik nie jest zalogowany lub nie ma aktywnego zamówienia.");
  }
  const { productId, quantity, size } = req.body;

  try {
    // Najpierw znajdź id_rozmiaru na podstawie rozmiaru
    const sizeResult = await pool.query(
      "SELECT id_rozmiaru FROM rozmiary WHERE rozmiar = $1",
      [size]
    );
    if (sizeResult.rows.length === 0) {
      console.log("size not found");
      return res.status(404).send("Podany rozmiar nie istnieje.");
    }
    const id_rozmiaru = sizeResult.rows[0].id_rozmiaru;

    const existingProductResult = await pool.query(
      "SELECT * FROM zamowienia_produkty WHERE id_zamowienia = $1 AND id_produktu = $2 AND id_rozmiaru = $3",
      [req.session.orderId, productId, id_rozmiaru]
    );

    if (existingProductResult.rows.length > 0) {
      const existingProduct = existingProductResult.rows[0];
      const newQuantity = existingProduct.ilosc + quantity;
      if (newQuantity > 5) {
        return res
          .status(400)
          .send("Nie możesz dodać więcej niż 5 sztuk produktu.");
      }

      // Aktualizuj ilość istniejącego produktu w zamówieniu
      const updatedProductResult = await pool.query(
        "UPDATE zamowienia_produkty SET ilosc = $1 WHERE id_zamowienia = $2 AND id_produktu = $3 AND id_rozmiaru = $4 RETURNING *",
        [newQuantity, req.session.orderId, productId, id_rozmiaru]
      );
      res.json(updatedProductResult.rows[0]);
    } else {
      // Dodaj nowy produkt do zamówienia z danym id_rozmiaru
      const addedProductResult = await pool.query(
        "INSERT INTO zamowienia_produkty (id_zamowienia, id_produktu, ilosc, id_rozmiaru) VALUES ($1, $2, $3, $4) RETURNING *",
        [req.session.orderId, productId, quantity, id_rozmiaru]
      );
      res.json(addedProductResult.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.delete("/remove-product-from-order", async (req, res) => {
  console.log("trying to remove product from order");
  console.log("remove user: ", req.session.user);
  console.log("remove order: ", req.session.orderId);
  if (!req.session.user || !req.session.orderId) {
    return res
      .status(403)
      .send("Użytkownik nie jest zalogowany lub nie ma aktywnego zamówienia.");
  }

  const { productId, size } = req.body;
  console.log("remove size: ", size);
  console.log("remove productId: ", productId);

  try {
    const sizeResult = await pool.query(
      "SELECT id_rozmiaru FROM rozmiary WHERE rozmiar = $1",
      [size]
    );
    if (sizeResult.rows.length === 0) {
      return res.status(404).send("Podany rozmiar nie istnieje.");
    }
    const id_rozmiaru = sizeResult.rows[0].id_rozmiaru;

    await pool.query(
      "DELETE FROM zamowienia_produkty WHERE id_zamowienia = $1 AND id_produktu = $2 AND id_rozmiaru = $3",
      [req.session.orderId, productId, id_rozmiaru]
    );

    res.send("Produkt usunięty z zamówienia.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/cart-items", async (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ message: "Użytkownik nie jest zalogowany." });
  }

  const userId = req.session.user.id;

  try {
    const currentOrderResult = await pool.query(
      "SELECT id_zamowienia FROM zamowienia WHERE id_klienta = $1 AND data_zlozenia_zamowienia IS NULL",
      [userId]
    );

    if (currentOrderResult.rowCount === 0) {
      return res.status(404).json({ message: "Brak bieżącego zamówienia." });
    }

    const currentOrderId = currentOrderResult.rows[0].id_zamowienia;

    const cartItemsResult = await pool.query(
      "SELECT p.id_produktu, p.nazwa, p.cena_netto_sprzedazy, p.obrazek, r.rozmiar, zp.ilosc FROM produkty p INNER JOIN zamowienia_produkty zp ON p.id_produktu = zp.id_produktu INNER JOIN rozmiary r ON p.id_rozmiaru = r.id_rozmiaru WHERE zp.id_zamowienia = $1",
      [currentOrderId]
    );

    const cartItems = cartItemsResult.rows.map((row) => ({
      id: row.id_produktu,
      name: row.nazwa,
      size: row.rozmiar,
      price: row.cena_netto_sprzedazy,
      quantity: row.ilosc,
      image: row.obrazek,
    }));

    console.log("cart itemy: ", cartItems);

    res.json(cartItems);
  } catch (error) {
    console.error("Błąd podczas pobierania produktów z koszyka:", error);
    res.status(500).json({
      message: "Błąd serwera podczas pobierania produktów z koszyka.",
    });
  }
});

app.post("/finalize-order", async (req, res) => {
  console.log("finalize, user: ", req.session.user);
  console.log("finalize, order: ", req.session.orderId);
  if (!req.session.user || !req.session.orderId) {
    return res
      .status(403)
      .send("Użytkownik nie jest zalogowany lub nie ma aktywnego zamówienia.");
  }
  const orderId = req.session.orderId;
  try {
    await pool.query(
      "UPDATE zamowienia SET data_zlozenia_zamowienia = NOW() WHERE id_zamowienia = $1",
      [orderId]
    );
    req.session.orderId = null;
    //req.session.save();
    res.json({ message: "Zamówienie zostało zrealizowane." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
