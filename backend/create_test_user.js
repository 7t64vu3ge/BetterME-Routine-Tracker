const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Habit = require('./models/Habit');
const Routine = require('./models/Routine');
const HabitLog = require('./models/HabitLog');

const MONGODB_URI = process.env.MONGODB_URI;

const createTestUser = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');

        const username = 'testuser';
        const password = 'password123';

        // Cleanup existing testuser
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            await Habit.deleteMany({ user: existingUser._id });
            await Routine.deleteMany({ user: existingUser._id });
            await HabitLog.deleteMany({ user: existingUser._id });
            await User.deleteOne({ _id: existingUser._id });
            console.log('Cleaned up existing testuser');
        }

        // 1. Create User
        const user = new User({ username, password });
        await user.save();
        console.log(`User created: ${username} / ${password}`);

        // 2. Create Habits
        const habits = [
            { name: 'Meditation', category: 'Health', targetType: 'time', targetValue: 15 },
            { name: 'Code Practice', category: 'Work', targetType: 'time', targetValue: 60 },
            { name: 'Journaling', category: 'Personal', targetType: 'count', targetValue: 1 }
        ];

        const createdHabits = [];
        for (const h of habits) {
            const habit = new Habit({ ...h, user: user._id });
            await habit.save();
            createdHabits.push(habit);
        }

        // 3. Generate Random History (Last 60 days)
        const today = new Date();
        const logs = [];

        for (let i = 60; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Meditation: Random gaps
            if (Math.random() > 0.4) {
                logs.push({
                    user: user._id,
                    habit: createdHabits[0]._id,
                    date: dateStr,
                    completed: true,
                    progress: 15
                });
            }

            // Code Practice: Consistent
            if (Math.random() > 0.2) {
                logs.push({
                    user: user._id,
                    habit: createdHabits[1]._id,
                    date: dateStr,
                    completed: true,
                    progress: 60
                });
            }
        }

        await HabitLog.insertMany(logs);
        console.log(`Generated ${logs.length} logs for testuser`);

        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestUser();
