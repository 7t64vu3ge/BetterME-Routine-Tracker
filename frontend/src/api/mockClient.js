import AsyncStorage from '@react-native-async-storage/async-storage';
// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
    USERS: 'db_users',
    HABITS: 'db_habits',
    ROUTINES: 'db_routines',
    LOGS: 'db_logs',
};

// Mock Client Implementation
const mockClient = {
    get: async (url) => {
        await delay(500); // Simulate network latency
        console.log(`[MockAPI] GET ${url}`);

        if (url === '/habits') {
            const habits = await getList(STORAGE_KEYS.HABITS);
            return { data: habits };
        }

        if (url.startsWith('/habits/logs/')) {
            const date = url.split('/').pop();
            const logs = await getList(STORAGE_KEYS.LOGS);
            const daysLogs = logs.filter(l => l.date === date);
            return { data: daysLogs };
        }

        if (url === '/routines') {
            const routines = await getList(STORAGE_KEYS.ROUTINES);
            // Populate habits for routines if needed, but the UI just needs IDs usually or basic info
            // The UI expects routines to have a 'habits' array. In the DB it might be IDs.
            // Let's check how we store it. We'll store full objects or hydrate them.
            // For simplicity, let's assume we store IDs but hydration is better.
            // Re-reading RoutinesScreen.js: it expects item.habits to be an array of objects with { name }.
            
            const allHabits = await getList(STORAGE_KEYS.HABITS);
            const hydratedRoutines = routines.map(r => ({
                ...r,
                habits: r.habits.map(hId => allHabits.find(h => h._id === hId)).filter(Boolean)
            }));
            return { data: hydratedRoutines };
        }

        if (url === '/stats/heatmap') {
            const logs = await getList(STORAGE_KEYS.LOGS);
            const heatmap = {};
            logs.forEach(l => {
                if (l.completed) {
                    heatmap[l.date] = (heatmap[l.date] || 0) + 1;
                }
            });
            return { data: heatmap };
        }

        if (url === '/stats/streaks') {
            const habits = await getList(STORAGE_KEYS.HABITS);
            const logs = await getList(STORAGE_KEYS.LOGS);
            
            const streaks = habits.map(h => {
                const hLogs = logs.filter(l => l.habit === h._id && l.completed).sort((a, b) => new Date(a.date) - new Date(b.date));
                // Calculate streaks (simplified)
                let current = 0;
                let longest = 0;
                // This is a complex calculation, for now returning 0s or simple counts
                // Real implementation would require iterating dates.
                // Let's do a simple count for now to make it functional.
                const count = hLogs.length;
                return {
                    habitId: h._id,
                    name: h.name,
                    currentStreak: count, // Placeholder
                    longestStreak: count  // Placeholder
                };
            });
            return { data: streaks };
        }

        return Promise.reject({ response: { status: 404, data: 'Not Found' } });
    },

    post: async (url, body) => {
        await delay(500);
        console.log(`[MockAPI] POST ${url}`, body);

        if (url === '/auth/signin') {
            const users = await getList(STORAGE_KEYS.USERS);
            const user = users.find(u => u.username === body.username && u.password === body.password);
            if (user) {
                return { data: { token: 'mock-token', user } };
            }
            return Promise.reject({ response: { status: 401, data: 'Invalid credentials' } });
        }

        if (url === '/auth/signup') {
            const users = await getList(STORAGE_KEYS.USERS);
            if (users.find(u => u.username === body.username)) {
                return Promise.reject({ response: { status: 400, data: 'User exists' } });
            }
            const newUser = { ...body, _id: generateId() };
            await saveItem(STORAGE_KEYS.USERS, newUser);
            return { data: { token: 'mock-token', user: newUser } };
        }

        if (url === '/habits') {
            const newHabit = { ...body, _id: generateId(), isActive: true, createdAt: new Date().toISOString() };
            await saveItem(STORAGE_KEYS.HABITS, newHabit);
            return { data: newHabit };
        }

        if (url === '/habits/log') {
            // body: { habitId, date, completed, progress }
            const logs = await getList(STORAGE_KEYS.LOGS);
            const existingIndex = logs.findIndex(l => l.habit === body.habitId && l.date === body.date);
            
            let newLog;
            if (existingIndex >= 0) {
                newLog = { ...logs[existingIndex], ...body, habit: body.habitId }; // ensure habit field is set
                logs[existingIndex] = newLog;
                await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
            } else {
                newLog = { ...body, _id: generateId(), habit: body.habitId };
                await saveItem(STORAGE_KEYS.LOGS, newLog);
            }
            return { data: newLog };
        }

        if (url === '/routines') {
            const newRoutine = { ...body, _id: generateId(), createdAt: new Date().toISOString() };
            await saveItem(STORAGE_KEYS.ROUTINES, newRoutine);
            return { data: newRoutine };
        }

        return Promise.reject({ response: { status: 404, data: 'Not Found' } });
    },

    delete: async (url) => {
        await delay(500);
        console.log(`[MockAPI] DELETE ${url}`);

        if (url.startsWith('/habits/')) {
            const id = url.split('/').pop();
            await deleteItem(STORAGE_KEYS.HABITS, id);
            // Also delete related logs? Maybe not strictly necessary for MVP
            return { data: { success: true } };
        }

        if (url.startsWith('/routines/')) {
            const id = url.split('/').pop();
            await deleteItem(STORAGE_KEYS.ROUTINES, id);
            return { data: { success: true } };
        }

        return Promise.reject({ response: { status: 404, data: 'Not Found' } });
    }
};

// Storage Helpers
async function getList(key) {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : [];
}

async function saveItem(key, item) {
    const list = await getList(key);
    list.push(item);
    await AsyncStorage.setItem(key, JSON.stringify(list));
}

async function deleteItem(key, id) {
    const list = await getList(key);
    const filtered = list.filter(i => i._id !== id);
    await AsyncStorage.setItem(key, JSON.stringify(filtered));
}

export default mockClient;
