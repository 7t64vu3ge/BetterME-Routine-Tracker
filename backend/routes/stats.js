const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const HabitLog = require('../models/HabitLog');

// @route   GET /api/stats/heatmap
// @desc    Get heatmap data (count of completed habits per day)
// @access  Private
router.get('/heatmap', auth, async (req, res) => {
    try {
        const logs = await HabitLog.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id), completed: true } },
            {
                $group: {
                    _id: '$date',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Transform to object { date: count }
        const heatmapData = {};
        logs.forEach(log => {
            heatmapData[log._id] = log.count;
        });

        res.json(heatmapData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/stats/streaks
// @desc    Get current and longest streaks for each habit
// @access  Private
router.get('/streaks', auth, async (req, res) => {
    try {
        const habits = await require('../models/Habit').find({ user: req.user.id });
        const logs = await HabitLog.find({ user: req.user.id, completed: true }).sort({ date: 1 });

        const streakData = habits.map(habit => {
            const habitLogs = logs.filter(log => log.habit.toString() === habit._id.toString());
            const dates = habitLogs.map(log => log.date); // Sorted dates

            let currentStreak = 0;
            let longestStreak = 0;
            let tempStreak = 0;

            // Calculate streaks
            for (let i = 0; i < dates.length; i++) {
                if (i === 0) {
                    tempStreak = 1;
                } else {
                    const prevDate = new Date(dates[i - 1]);
                    const currDate = new Date(dates[i]);
                    const diffTime = Math.abs(currDate - prevDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        tempStreak++;
                    } else {
                        if (tempStreak > longestStreak) longestStreak = tempStreak;
                        tempStreak = 1;
                    }
                }
            }
            if (tempStreak > longestStreak) longestStreak = tempStreak;

            // Check if current streak is active (completed today or yesterday)
            if (dates.length > 0) {
                const lastDate = new Date(dates[dates.length - 1]);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                // Parse lastDate as local date to avoid timezone issues with simple string comparison if possible, 
                // but dates are stored as YYYY-MM-DD strings. 
                // Let's stick to string comparison for simplicity and consistency with storage.
                const lastDateStr = dates[dates.length - 1];
                const todayStr = today.toISOString().split('T')[0];
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
                    currentStreak = tempStreak;
                } else {
                    currentStreak = 0;
                }
            }

            return {
                habitId: habit._id,
                name: habit.name,
                currentStreak,
                longestStreak
            };
        });

        res.json(streakData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
