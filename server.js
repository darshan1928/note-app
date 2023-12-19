const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv")
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
dotenv.config()
// Connect to MongoDB (replace 'your_mongodb_url' with your actual MongoDB connection string)
mongoose.connect(process.env.MONGODB_URI);

// Define the Note schema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
});

const Note = mongoose.model('Note', noteSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/login', async (req, res) => {

  const userId = '123';
  const token = jwt.sign({ userId }, process.env.SECRET_KEY);
  res.json({ token });
});

app.get('/notes', authenticateToken, async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId });
  res.json(notes);
});

app.post('/notes', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content, userId: req.user.userId });
  await note.save();
  res.json(note);
});

app.put('/notes/:id', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
  res.json(note);
});

app.delete('/notes/:id', authenticateToken, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
