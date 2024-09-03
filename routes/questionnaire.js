const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

router.post('/', async (req, res) => {
  try {
    const { responses } = req.body;

    // Initialize score
    let score = 0;

    // Scoring based on responses
    responses.forEach((response, index) => {
      switch (index) {
        case 0: // Question about brushing frequency
          if (response === "Three or more times") {
            score += 40;
          } else if (response === "Twice") {
            score += 30;
          } else if (response === "Once") {
            score += 20;
          } else if (response === "I don't brush daily") {
            score += 10;
          }
          break;
        case 1: // Question about flossing
          if (response === "Daily") {
            score += 30;
          } else if (response === "3-5 times a week") {
            score += 20;
          } else if (response === "1-2 times a week") {
            score += 10;
          } else if (response === "Rarely or never") {
            score += 5;
          }
          break;
        case 2: // Question about dentist visits
          if (response === "Every 6 months") {
            score += 30;
          } else if (response === "Once a Year") {
            score += 20;
          } else if (response === "Every 2 years") {
            score += 10;
          } else if (response === "I can't remember my last visit") {
            score += 5;
          }
          break;
        case 3: // Ongoing dental conditions
          if (response.includes("Yes")) {
            score -= 10; // Major negative impact
          }
          break;
        case 4: // Recent oral health issues
          if (response.includes("Tooth pain") || response.includes("Bleeding gums")) {
            score -= 15; // Major negative impact
          } else if (response.includes("Sensitivity to hot or cold")) {
            score -= 10;
          }
          break;
        case 5: // Tobacco use
          if (response === "Yes") {
            score -= 20; // Major negative impact
          }
          break;
        default:
          break;
      }
    });

    // Ensure score is within a reasonable range
    score = Math.max(0, Math.min(score, 100));

    const newResponse = new Response({
      userId: 'user-id-placeholder',  // Replace with actual user ID if needed
      responses,
      score,
    });

    await newResponse.save();

    res.json({ score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Route for opt-in
router.post('/opt-in', (req, res) => {
  const { emailOptIn, score } = req.body;
  if (emailOptIn) {
    // Handle opt-in logic
    res.status(200).json({ success: true, message: 'Opt-in successful.' });
  } else {
    res.status(400).json({ success: false, message: 'Opt-in failed.' });
  }
});

module.exports = router;
