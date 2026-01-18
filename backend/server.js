const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3)',
      [full_name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    const { user_id, service_id, appointment_date, appointment_time } = req.body;

    if (!user_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await pool.query(
      `INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, service_id, appointment_date, appointment_time]
    );

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/services', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT service_id, service_name, description, duration_minutes, price FROM services'
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});