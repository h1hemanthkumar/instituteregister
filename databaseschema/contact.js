const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    emailid: { type: String, required: true }, 
    username: { type: String, required: true },
    about: { type: String, required: true },
    question: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); 
const Contact = mongoose.model('Contact', contactSchema, 'contacters');

module.exports = Contact;
