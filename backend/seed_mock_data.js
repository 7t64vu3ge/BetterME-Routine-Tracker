const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Habit = require('./models/Habit');
const Routine = require('./models/Routine');
const HabitLog = require('./models/HabitLog');

const uri = process.env.MONGODB_URI;

async function seed() {
    try {
        await mongoose.connect(uri);
        console.log('DB connected');

        const uName = 'mockuser';
        const pass = 'password123';

        // clear old one
        await User.deleteOne({ username: uName });

        const user = new User({ username: uName, password: pass });
        await user.save();
        console.log('User ready');

        // habits
        const habitsList = [
            { name: 'Morning Jog', category: 'Health', targetType: 'time', targetValue: 30 },
            { name: 'Read Book', category: 'Personal', targetType: 'time', targetValue: 20 },
            { name: 'Drink Water', category: 'Health', targetType: 'count', targetValue: 8 }
        ];

        let savedHabits = [];
        for (let habitData of habitsList) {
            let savedHabit = await new Habit({ ...habitData, user: user._id }).save();
            savedHabits.push(savedHabit);
        }

        // routine
        await new Routine({
            user: user._id,
            name: 'Morning Routine',
            habits: savedHabits.map(h => h._id)
        }).save();

        // generate logs
        const today = new Date();
        let logs = [];

        // last 3 months
        for (let i = 0; i < 90; i++) {
            let logDate = new Date(today);
            logDate.setDate(logDate.getDate() - i);
            let dateString = logDate.toISOString().slice(0, 10);

            // jog - mostly consistent
            if (Math.random() > 0.3) {
                logs.push({
                    user: user._id,
                    habit: savedHabits[0]._id,
                    date: dateString,
                    completed: true,
                    progress: 30
                });
            }

            // reading - hit or miss
            if (Math.random() > 0.6) {
                logs.push({
                    user: user._id,
                    habit: savedHabits[1]._id,
                    date: dateString,
                    completed: true,
                    progress: 20
                });
            }

            // water - good streak
            if (Math.random() > 0.15) {
                logs.push({
                    user: user._id,
                    habit: savedHabits[2]._id,
                    date: dateString,
                    completed: true,
                    progress: 8
                });
            }
        }

        await HabitLog.insertMany(logs);
        console.log(`Inserted ${logs.length} logs`);

        console.log('Seed done');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
