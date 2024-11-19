const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    credits: { type: Number }
});

module.exports = mongoose.model('Course', CourseSchema);
