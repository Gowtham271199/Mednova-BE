const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Added for email functionality
const authRoutes = require('./routes/auth');
const questionnaireRoutes = require('./routes/questionnaire');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Status route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questionnaire', questionnaireRoutes);

// Email sending function
const sendPersonalizedEmail = async (email, score) => {
  // Create transporter object
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Can be replaced with other services like SendGrid
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  // Email content
  let mailOptions = {
    from: '"Dental Care" <your-email@gmail.com>', // Sender address
    to: email, // List of receivers
    subject: 'Your Personalized Dental Care Tips',
    html: `<p>Dear User,</p>
           <p>Your dental score is ${score}.</p>
           <p>Here are some personalized tips to improve your dental health:</p>
           <ul>
             <li>Brush your teeth twice a day.</li>
             <li>Floss regularly.</li>
             <li>Visit your dentist every 6 months.</li>
           </ul>
           <p>Best regards,</p>
           <p>The Dental Care Team</p>`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Route for sending personalized email
app.post('/api/send-email', async (req, res) => {
  const { email, score } = req.body;

  try {
    await sendPersonalizedEmail(email, score);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
