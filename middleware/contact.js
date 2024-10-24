const Contact = require('../databaseschema/contact'); // Adjust the path if necessary
const express = require('express');
const router = express.Router();

// POST endpoint to handle contact form submissions
router.post('/contact', async (req, res) => {
    const { emailid, username, about, question } = req.body;

    // Check if all required fields are provided
    if (!emailid || !username || !about || !question) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMessages = await Contact.find({
        username: username,
        createdAt: { $gte: twentyFourHoursAgo }
    });

    if (recentMessages.length > 0) {
        return res.status(400).json({ message: 'You can only send one message every 24 hours.' });
    }

    const newContact = new Contact({ emailid, username, about, question });

    try {
        await newContact.save();
        return res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving message:', error); // Log the error for debugging
        return res.status(500).json({ error: 'An error occurred while sending the message.' });
    }
});

module.exports = router;
