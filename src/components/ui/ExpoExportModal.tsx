import React, { useState } from 'react';
import { X, Download, Copy, Check, Terminal, Smartphone, FolderClosed, FileCode, ExternalLink } from 'lucide-react';
import JSZip from 'jszip';

interface FileEntry {
  path: string;
  name: string;
  category: 'config' | 'screen' | 'component' | 'context';
  code: string;
}

const EXPO_FILES: FileEntry[] = [
  {
    path: 'package.json',
    name: 'package.json',
    category: 'config',
    code: `{
  "name": "spawn-mobile",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-constants": "~17.0.0",
    "expo-linking": "~7.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-haptics": "~14.0.0",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-svg": "15.8.0",
    "lucide-react-native": "^0.475.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.12",
    "typescript": "^5.3.3"
  },
  "private": true
}`,
  },
  {
    path: 'app.json',
    name: 'app.json',
    category: 'config',
    code: `{
  "expo": {
    "name": "Spawn",
    "slug": "spawn-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "spawn",
    "userInterfaceStyle": "dark",
    "newArchEnabled": true,
    "android": {
      "package": "com.spawn.personalos",
      "navigationBar": {
        "backgroundColor": "#0D0D0C",
        "barStyle": "light-content"
      },
      "statusBar": {
        "backgroundColor": "#0D0D0C",
        "barStyle": "light-content"
      }
    },
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}`,
  },
  {
    path: 'app/_layout.tsx',
    name: '_layout.tsx',
    category: 'screen',
    code: `import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/context/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" backgroundColor="#0D0D0C" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0D0D0C' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="project/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="tasks" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="add-task" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="focus/[taskId]" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="modal/recommendation" options={{ headerShown: false, presentation: 'transparentModal' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}`,
  },
  {
    path: 'app/(tabs)/_layout.tsx',
    name: '(tabs)/_layout.tsx',
    category: 'screen',
    code: `import React from 'react';
import { Tabs } from 'expo-router';
import { Home, FolderClosed, Radio, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0D0C',
          borderTopColor: '#1D1D1A',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#F06A3A',
        tabBarInactiveTintColor: '#6F6D67',
        tabBarLabelStyle: {
          fontFamily: 'monospace',
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home color={color} size={20} /> }} />
      <Tabs.Screen name="projects" options={{ title: 'Projects', tabBarIcon: ({ color }) => <FolderClosed color={color} size={20} /> }} />
      <Tabs.Screen name="radar" options={{ title: 'Radar', tabBarIcon: ({ color }) => <Radio color={color} size={20} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={20} /> }} />
    </Tabs>
  );
}`,
  },
  {
    path: 'app/(tabs)/index.tsx',
    name: 'Home (index.tsx)',
    category: 'screen',
    code: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, Calendar, ArrowRight, Plus, Sparkles, Check, ChevronRight } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { CatIllustration } from '../../src/components/CatIllustration';
import { SignalRail } from '../../src/components/SignalRail';

export default function HomeScreen() {
  const router = useRouter();
  const { recommendation, tasks, toggleTask, startFocus } = useApp();
  const todayTasks = tasks.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateText}>THURSDAY, 17 SEPTEMBER</Text>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingLight}>Good morning,</Text>
            <Text style={styles.greetingBold}>Abhi</Text>
            <Text style={styles.greetingSub}>You have {todayTasks.length} things to work on today.</Text>
          </View>
          <CatIllustration pose="recommendation" size={64} interactive onTap={() => router.push('/modal/recommendation')} />
        </View>

        {/* Recommendation Card */}
        <View style={styles.cardContainer}>
          <SignalRail color="#F06A3A" width={4} />
          <View style={styles.cardContent}>
            <Text style={styles.doThisNowLabel}>DO THIS NOW</Text>
            <Text style={styles.cardTitle}>{recommendation.title}</Text>
            <Text style={styles.cardProject}>{recommendation.projectName}</Text>
            <Pressable
              style={styles.startButton}
              onPress={() => {
                startFocus(recommendation.taskId);
                router.push(\`/focus/\${recommendation.taskId}\`);
              }}
            >
              <Text style={styles.startButtonText}>Start</Text>
              <ArrowRight size={14} color="#0D0D0C" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}`,
  },
  {
    path: 'app/focus/[taskId].tsx',
    name: 'Focus Session (Timer)',
    category: 'screen',
    code: `import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Play, Pause, CheckCircle2, RotateCcw } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { FocusTimer } from '../../src/components/FocusTimer';
import { CatIllustration } from '../../src/components/CatIllustration';

export default function FocusSessionScreen() {
  const router = useRouter();
  const { focusSession, pauseFocus, resumeFocus, finishFocus, resetFocus, toggleSubtask } = useApp();

  if (!focusSession) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FocusTimer
          remainingSeconds={focusSession.remainingSeconds}
          totalSeconds={focusSession.totalSeconds}
          isRunning={focusSession.isRunning}
          size={220}
        />
        <View style={styles.controlsRow}>
          <Pressable onPress={resetFocus}><RotateCcw size={18} color="#A09E97" /></Pressable>
          {focusSession.isRunning ? (
            <Pressable style={styles.primaryBtn} onPress={pauseFocus}><Pause size={20} color="#0D0D0C" /></Pressable>
          ) : (
            <Pressable style={styles.primaryBtn} onPress={resumeFocus}><Play size={20} color="#0D0D0C" /></Pressable>
          )}
          <Pressable onPress={finishFocus}><CheckCircle2 size={18} color="#B7D96B" /></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}`,
  },
  {
    path: 'src/components/CatIllustration.tsx',
    name: 'CatIllustration.tsx',
    category: 'component',
    code: `import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle, Line, Ellipse } from 'react-native-svg';

export const CatIllustration: React.FC<{ pose?: string; size?: number; interactive?: boolean; onTap?: () => void }> = ({
  pose = 'idle',
  size = 64,
  interactive = false,
  onTap,
}) => {
  return (
    <Pressable disabled={!interactive} onPress={onTap}>
      <Svg width={size} height={size * 0.9} viewBox="0 0 80 72" fill="none">
        <Path d="M 28 62 C 24 50 25 32 38 24 C 48 18 60 22 64 36 C 68 50 64 62 50 64 Z" stroke="#F06A3A" strokeWidth="2" />
        <Circle cx="36" cy="24" r="14" stroke="#F06A3A" strokeWidth="2" />
        <Path d="M 26 17 L 22 5 L 33 12" stroke="#F06A3A" strokeWidth="2" />
        <Path d="M 39 12 L 48 6 L 46 18" stroke="#F06A3A" strokeWidth="2" />
        <Line x1="18" y1="23" x2="27" y2="24" stroke="#F06A3A" strokeWidth="1.4" />
        <Line x1="44" y1="24" x2="53" y2="23" stroke="#F06A3A" strokeWidth="1.4" />
      </Svg>
    </Pressable>
  );
};`,
  },
  {
    path: 'src/components/FocusTimer.tsx',
    name: 'FocusTimer.tsx',
    category: 'component',
    code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export const FocusTimer: React.FC<{ remainingSeconds: number; totalSeconds: number; isRunning: boolean; size?: number }> = ({
  remainingSeconds,
  totalSeconds,
  isRunning,
  size = 220,
}) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  const time = \`\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}\`;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke="#1F1F1C" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="#F06A3A"
          strokeWidth={strokeWidth}
          strokeDasharray={\`\${circumference} \${circumference}\`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 38, fontWeight: '700', color: '#F1EFE8' }}>{time}</Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#6F6D67', letterSpacing: 2 }}>
          {isRunning ? 'FOCUSING' : remainingSeconds === 0 ? 'COMPLETED' : 'PAUSED'}
        </Text>
      </View>
    </View>
  );
};`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'config',
    code: `# Spawn Mobile (React Native + Expo SDK 52)

Run directly on your Android Emulator or Android Device:

1. npm install
2. npx expo start --android

(Or open Expo Go on your Android phone and scan the terminal QR code)`,
  },
];

export const ExpoExportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const currentFile = EXPO_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all Expo files
      for (const file of EXPO_FILES) {
        zip.file(file.path, file.code);
      }

      // Add tsconfig & babel
      zip.file('tsconfig.json', JSON.stringify({ extends: 'expo/tsconfig.base', compilerOptions: { strict: true } }, null, 2));
      zip.file('babel.config.js', `module.exports = function(api) { api.cache(true); return { presets: ['babel-preset-expo'] }; };`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spawn-react-native-expo.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111110] border border-[#292925] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-[#F1EFE8]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1D1D1A] bg-[#141413]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F06A3A]/10 border border-[#F06A3A]/30 flex items-center justify-center text-[#F06A3A]">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono tracking-tight">
                  React Native + Expo SDK 52 Project
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#B7D96B]/15 text-[#B7D96B] border border-[#B7D96B]/30 font-semibold">
                  Android Ready
                </span>
              </div>
              <p className="text-xs text-[#A09E97]">
                Complete mobile codebase ready to run on any Android Emulator or Physical Device
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-3.5 py-2 rounded-lg bg-[#F06A3A] hover:bg-[#F27E53] text-[#0D0D0C] font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isZipping ? 'Bundling ZIP...' : 'Download Project (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A09E97] hover:text-[#F1EFE8] hover:bg-[#1C1C1A] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Instructions Banner */}
        <div className="bg-[#181817] px-6 py-3 border-b border-[#292925] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#A09E97]">
            <Terminal size={14} className="text-[#F06A3A]" />
            <span>Run on Android:</span>
            <code className="px-2 py-0.5 rounded bg-[#0D0D0C] text-[#F1EFE8] border border-[#292925]">
              npm install && npx expo start --android
            </code>
          </div>
          <span className="text-[#6F6D67] text-[11px]">
            Compatible with Android Studio AVD &amp; Expo Go
          </span>
        </div>

        {/* Content Split: File Tree + Code Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-64 border-r border-[#1D1D1A] bg-[#0D0D0C] p-3 overflow-y-auto">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6F6D67] px-2 mb-2">
              Project Structure
            </div>
            <div className="space-y-1">
              {EXPO_FILES.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-2.5 py-2 rounded-md font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                    selectedFileIndex === idx
                      ? 'bg-[#1D1D1A] text-[#F06A3A] font-semibold border-l-2 border-[#F06A3A]'
                      : 'text-[#A09E97] hover:text-[#F1EFE8] hover:bg-[#141413]'
                  }`}
                >
                  <FileCode size={13} className="shrink-0 opacity-75" />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#0A0A09] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#1D1D1A] bg-[#111110]">
              <span className="font-mono text-xs text-[#A09E97]">{currentFile.path}</span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-[#181817] hover:bg-[#222220] border border-[#292925] text-xs font-mono text-[#A09E97] hover:text-[#F1EFE8] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-[#B7D96B]" /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-[#E1DFD7] leading-relaxed select-text">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
