const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    uniqueId: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);
