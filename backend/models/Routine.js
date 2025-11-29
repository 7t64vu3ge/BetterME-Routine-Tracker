const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    habits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Routine', RoutineSchema);
