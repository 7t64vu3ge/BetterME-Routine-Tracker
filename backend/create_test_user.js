const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Habit = require('./models/Habit');
const Routine = require('./models/Routine');
const HabitLog = require('./models/HabitLog');

const db = process.env.MONGODB_URI;

const run = async () => {
    try {
        await mongoose.connect(db);
        console.log('Connected to DB');

        const usr = 'testuser';
        const pwd = 'password123';

        // nuke old data if it exists
        const oldUser = await User.findOne({ username: usr });
        if (oldUser) {
            console.log('Found old user, cleaning up...');
            await Habit.deleteMany({ user: oldUser._id });
            await Routine.deleteMany({ user: oldUser._id });
            await HabitLog.deleteMany({ user: oldUser._id });
            await User.deleteOne({ _id: oldUser._id });
        }

        const newUser = new User({ username: usr, password: pwd });
        await newUser.save();
        console.log('Created user:', usr);

        // add some habits
        const h1 = await new Habit({ user: newUser._id, name: 'Meditation', category: 'Health', targetType: 'time', targetValue: 15 }).save();
        const h2 = await new Habit({ user: newUser._id, name: 'Code Practice', category: 'Work', targetType: 'time', targetValue: 60 }).save();
        const h3 = await new Habit({ user: newUser._id, name: 'Journaling', category: 'Personal', targetType: 'count', targetValue: 1 }).save();

        // fake history
        const logs = [];
        const now = new Date();

        // go back 60 days
        for (let i = 0; i < 60; i++) {
            const logDate = new Date(now);
            logDate.setDate(logDate.getDate() - i);
            const dStr = logDate.toISOString().split('T')[0];

            // random completion
            if (Math.random() > 0.5) {
                logs.push({
                    user: newUser._id,
                    habit: h1._id,
                    date: dStr,
                    completed: true,
                    progress: 15
                });
            }

            if (Math.random() > 0.3) {
                logs.push({
                    user: newUser._id,
                    habit: h2._id,
                    date: dStr,
                    completed: true,
                    progress: 60
                });
            }
        }

        await HabitLog.insertMany(logs);
        console.log('Added logs');

        console.log('Done');
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};

run();
