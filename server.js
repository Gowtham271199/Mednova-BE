const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const questionnaireRoutes = require('./routes/questionnaire');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Existing code

// Status route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Existing code

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/questionnaire', questionnaireRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
