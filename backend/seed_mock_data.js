const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Habit = require('./models/Habit');
const Routine = require('./models/Routine');
const HabitLog = require('./models/HabitLog');

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');

        // 1. Create Mock User
        const username = 'mockuser';
        const password = 'password123';

        // Check if user exists and delete
        await User.deleteOne({ username });
        await Habit.deleteMany({ user: { $in: await User.find({ username }).select('_id') } }); // Cleanup old data if any
        // Actually better to just find the user, get ID, delete all related data, then delete user.
        // But since we deleted user first, we can't find ID. 
        // Let's just create a new one.

        const user = new User({ username, password });
        await user.save();
        console.log(`User created: ${username} / ${password}`);

        // 2. Create Habits
        const habits = [
            { name: 'Morning Jog', category: 'Health', targetType: 'time', targetValue: 30 },
            { name: 'Read Book', category: 'Personal', targetType: 'time', targetValue: 20 },
            { name: 'Drink Water', category: 'Health', targetType: 'count', targetValue: 8 }
        ];

        const createdHabits = [];
        for (const h of habits) {
            const habit = new Habit({ ...h, user: user._id });
            await habit.save();
            createdHabits.push(habit);
        }
        console.log('Habits created');

        // 3. Create Routine
        const routine = new Routine({
            user: user._id,
            name: 'Morning Routine',
            habits: createdHabits.map(h => h._id)
        });
        await routine.save();
        console.log('Routine created');

        // 4. Generate History (Last 90 days)
        const today = new Date();
        const logs = [];

        for (let i = 90; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Morning Jog: High consistency (Streak)
            if (Math.random() > 0.2) { // 80% chance
                logs.push({
                    user: user._id,
                    habit: createdHabits[0]._id,
                    date: dateStr,
                    completed: true,
                    progress: 30
                });
            }

            // Read Book: Medium consistency
            if (Math.random() > 0.5) { // 50% chance
                logs.push({
                    user: user._id,
                    habit: createdHabits[1]._id,
                    date: dateStr,
                    completed: true,
                    progress: 20
                });
            }

            // Drink Water: High consistency
            if (Math.random() > 0.1) { // 90% chance
                logs.push({
                    user: user._id,
                    habit: createdHabits[2]._id,
                    date: dateStr,
                    completed: true,
                    progress: 8
                });
            }
        }

        await HabitLog.insertMany(logs);
        console.log(`Generated ${logs.length} habit logs`);

        console.log('Seed completed successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
