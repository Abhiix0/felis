# Spawn Mobile (React Native + Expo SDK 52)

Dark notebook personal OS prototype for developers. Built with React Native, Expo Router v4, TypeScript, Lucide Icons, and React Native SVG.

---

## 📱 How to Run on Android Emulator or Device

### Prerequisites
- Node.js 18+ installed
- For Android Emulator: **Android Studio** with an Android Virtual Device (AVD, e.g. Pixel 8 with Android 14/15) installed and running, with `ANDROID_HOME` configured.
- For Physical Android Phone: Install the **Expo Go** app from Google Play Store.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start on Android Emulator
Make sure your Android Emulator is running in Android Studio, then run:
```bash
npm run android
# or
npx expo start --android
```

### 3. Run with Expo Go (Physical Phone)
```bash
npm start
```
Scan the QR code displayed in the terminal using the Expo Go app on your Android device.

---

## 📂 Architecture Overview

- `app/_layout.tsx`: Root Stack navigator with Dark Notebook theme (`#0D0D0C`)
- `app/(tabs)/_layout.tsx`: Bottom Tab navigation (Home, Projects, Radar, Profile)
- `app/(tabs)/index.tsx`: Screen 02 Home with recommendation card, signal rail, tasks, cat illustration
- `app/(tabs)/projects.tsx`: Screen 03 Projects with search and project cards
- `app/(tabs)/radar.tsx`: Screen Radar (tech updates & signal status)
- `app/(tabs)/profile.tsx`: Screen Profile (settings & device signals)
- `app/project/[id].tsx`: Screen 04 Project Detail with tasks/notes tabs
- `app/tasks.tsx`: Screen 05 Tasks list with filters and FAB
- `app/add-task.tsx`: Screen 06 Add Task with AI tag parsing
- `app/focus/[taskId].tsx`: Screen 07 Focus Session with functional countdown timer & subtasks
- `app/modal/recommendation.tsx`: Screen 08 "What should I work on?" modal
- `src/components/CatIllustration.tsx`: Pure React Native SVG line-art cat
- `src/components/FocusTimer.tsx`: Pure React Native SVG circular countdown timer
- `src/context/AppContext.tsx`: Local state management with tick-by-tick timer logic
