# FELIS Workspace

Welcome to the FELIS repository.

> **IMPORTANT ARCHITECTURE NOTE**:
> This repository contains two codebases. **`expo-app/` is the single source of truth for the FELIS mobile application.**

---

## 📁 Repository Structure

```
felis/
├── expo-app/           # 📱 [PRIMARY PRODUCT] FELIS Mobile Application
│   ├── app/            # Expo Router v4 file-based routes
│   ├── src/            # Core React Native components, context, and types
│   ├── app.json        # Expo app configuration (slug: "felis")
│   └── package.json    # Mobile app dependencies and scripts
│
├── src/                # 🛠️ [DESIGN TOOL ONLY] Vite Web Preview & Export Tool
├── index.html          # Web entry for the design preview tool
├── vite.config.ts      # Vite configuration for design preview
└── package.json        # Dependencies for the web design preview tool
```

---

## 📱 FELIS Mobile Application (`expo-app/`)

The mobile application is a dark-themed developer personal OS built with:
- **Framework**: [Expo SDK 52](https://expo.dev) with [Expo Router v4](https://docs.expo.dev/router/introduction/)
- **Runtime**: React Native `0.76.6` (New Architecture enabled)
- **Language**: TypeScript (strict mode)
- **Styling & Icons**: Custom design system, Lucide React Native, and React Native SVG

### Getting Started with the Mobile App

1. Navigate to the mobile app directory:
   ```bash
   cd expo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

4. Run on platforms:
   - **Android Emulator / Device**: `npm run android`
   - **iOS Simulator**: `npm run ios`
   - **Web preview**: `npm run web`

---

## 🛠️ Web Design Preview Tool (`/`)

The root directory contains a Vite + React web application used strictly as a **design preview and prototype export tool**. It is **not** part of the shipped mobile application product.
