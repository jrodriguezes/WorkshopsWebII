const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    }, 
    description: {
        required: true,
        type: String
    },
    professorId: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Course', courseSchema)
