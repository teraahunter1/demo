const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: false
    },
    capital: {
        type: String,
        required: false
    },
    region: {
        type: String,
        required: false
    },
    population: {
        type: Number,
        required: false
    },
    currency: {
        type: String,
        required: false
    },
    resolved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', userSchema);

module.exports = Contact;