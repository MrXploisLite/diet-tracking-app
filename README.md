# Expo Nutrition Tracker

A React Native app built with Expo and TypeScript for tracking meals and nutrition.

## Features

- 📱 Cross-platform (iOS, Android, Web)
- 🍽️ Meal tracking with macronutrients
- 📊 Progress visualization
- 👤 User profile management
- 🌗 Light/Dark theme support
- 💾 Persistent local storage

## Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Charts**: Victory Native + React Native SVG

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/         # React Context providers (AppProvider)
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # Screen components (Home, Meals, Progress, Profile)
├── theme/          # Theme system (colors, typography, spacing)
├── types/          # TypeScript type definitions
└── utils/          # Utility functions (StorageService)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

Or use specific commands:

```bash
npm run android   # Open on Android
npm run ios       # Open on iOS (macOS only)
npm run web       # Open in web browser
```

### Using Expo Go

1. Install the Expo Go app on your iOS or Android device
2. Run `npm start` in the project directory
3. Scan the QR code displayed in the terminal or browser
4. The app will load on your device

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run web` - Start on web

## State Management

The app uses a global `AppProvider` context that manages:

- **Profile**: User information and daily nutrition goals
- **Meals**: Logged meals with macronutrients
- **Theme**: Light/dark mode preference

All state is automatically persisted to AsyncStorage and hydrated on app launch.

## Theme System

The theme system supports light and dark modes with:

- Color palettes (primary, secondary, background, surface, etc.)
- Typography scales (h1-h4, body, caption, small)
- Spacing tokens (xs, sm, md, lg, xl, xxl)

Toggle theme using the Profile screen settings.

## Storage

Data is persisted using AsyncStorage through a type-safe `StorageService`:

- Profile data
- Meal logs
- Theme preference

Default seed data is automatically created on first launch.

## Development

The app follows TypeScript strict mode and uses:

- Functional components with hooks
- React Context for state management
- Consistent naming conventions
- Modular code organization

## License

See LICENSE file for details.
