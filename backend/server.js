const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ---------------- GET ALL SERVICES ---------------- */
app.get("/services", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

/* ---------------- REGISTER ---------------- */
app.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3)",
      [full_name, email, password]
    );
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ---------------- LOGIN ---------------- */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT user_id FROM users WHERE email=$1 AND password_hash=$2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ user_id: result.rows[0].user_id });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* ---------------- BOOK APPOINTMENT ---------------- */
app.post("/book", async (req, res) => {
  const { user_id, service_id, date, time } = req.body;

  try {
    await pool.query(
      `INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time)
       VALUES ($1, $2, $3, $4)`,
      [user_id, service_id, date, time]
    );

    res.json({ message: "Booking successful" });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
