const mongoose = require('mongoose');


const HabitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name'] // custom error msg
    },
    category: {
        type: String,
        enum: ['Health', 'Work', 'Study', 'Personal', 'Other'],
        default: 'Personal'
    },
    targetType: {
        type: String,
        enum: ['count', 'time'],
        default: 'count'
    },
    targetValue: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Habit', HabitSchema);
