# BetterME - Routine Tracker

A mobile app for tracking daily habits and routines with visual analytics and progress monitoring.

## Features

- **Habit Tracking**: Create and monitor daily habits with ease
- **Routine Management**: Organize habits into routines for structured daily schedules
- **Heatmap Visualization**: Visual representation of your habit completion history
- **Progress Stats**: Track completion rates and streaks over time
- **User Authentication**: Secure login system with token-based auth
- **Theme Support**: Light and dark theme options

## Tech Stack

### Frontend
- React Native / Expo
- Context API for state management
- Custom theming system

### Backend
- Node.js with Express
- MongoDB for data persistence
- JWT authentication

## Project Structure

```
├── frontend/          # React Native mobile app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Context API providers
│   │   ├── navigation/   # App navigation
│   │   └── utils/        # Utilities (themes, helpers)
│   └── package.json
└── backend/           # Express API server
    ├── models/        # Database schemas
    ├── routes/        # API endpoints
    ├── middleware/    # Auth and validation
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI (for mobile development)

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Routes

- **Auth**: `/api/auth` - Login and registration
- **Habits**: `/api/habits` - CRUD operations for habits
- **Routines**: `/api/routines` - Manage routines
- **Stats**: `/api/stats` - Analytics and progress data

## Development

- Seed mock data: `node backend/seed_mock_data.js`
- Create test user: `node backend/create_test_user.js`

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!