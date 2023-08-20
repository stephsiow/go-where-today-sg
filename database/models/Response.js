const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    weather: {
        type: String
    },
    childAge: {
        type: Number, min: 0, max: 12
    },
    text: {
        type: String
    }
}, {timestamps: true});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
