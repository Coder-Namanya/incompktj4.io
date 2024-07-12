const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    temperature: {
        type: Number,
        default: null,
    },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
