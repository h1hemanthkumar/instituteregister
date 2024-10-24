const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 3000;
const Contact = require('./databaseschema/contact'); 
const register=require('./databaseschema/register')
const registerware=require('./middleware/registerware');
const window=require('window');
require('dotenv').config();
const MONGO_URI=process.env.MONGO_URI;


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));


app.use(express.static(path.join(__dirname)));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/api/contact', async (req, res) => {
    const { emailid, username, about, question } = req.body;
    

    if (!emailid || !username || !about || !question) {
        return res.status(400).json({ message: 'All fields are required.' });
    }


    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMessages = await Contact.find({
        username: username,
        createdAt: { $gte: twentyFourHoursAgo }
    });


    const newContact = new Contact({ emailid, username, about, question });

    try {
        await newContact.save();
        return res.status(201).redirect('/');
    } catch (error) {
         
       console.error('Error saving message:', error);
        return res.status(500).json({ error: 'An error occurred while sending the message.' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, emailid, phoneno, course } = req.body;

    
    if (!username || !emailid || !phoneno || !course) {
        return res.status(400).json({ message: 'All fields are required to register.' });
    }

    
    const users = await register.findOne({ emailid });

    if (users) {
        console.log('User already present');
        return res.status(400).json({ message: 'User already registered. Please use a different email or username.' });
    } else {
        const insert = new register({ username, emailid, phoneno, course });
        try {
            await insert.save();
            console.log("Registration successful");
            return res.status(201).json({ message: 'Successfully registered!' });
        } catch (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ message: 'An error occurred during registration.' });
        }
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});
