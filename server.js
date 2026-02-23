const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Simple in-memory users database
const users = {};

// OTP generation endpoint
app.post('/generate-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  users[phone] = { otp, created: Date.now() };
  res.json({ message: 'OTP generated', otp }); // for testing; hide in production
});

// OTP verification endpoint
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

  const record = users[phone];
  if (!record || record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  res.json({ message: 'OTP verified' });
});

// Test route
app.get('/', (req, res) => res.send('Secure Shield Backend Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
