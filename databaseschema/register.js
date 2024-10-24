const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    emailid: { type: String, required: true },
    username: { type: String, required: true },
    phoneno: { type: Number, required: true },
    course: { type:String,require:true}
}); 


const Register = mongoose.model('Register', registerSchema, 'registers');

module.exports = Register;
