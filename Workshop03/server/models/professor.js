const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    idNumber: {
        required: true,
        type: Number
    },
    name: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Professor', courseSchema)