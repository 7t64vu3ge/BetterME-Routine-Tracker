const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0
    },
    notes: String
});

// compound index to ensure one log per habit per day
LogSchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', LogSchema);
