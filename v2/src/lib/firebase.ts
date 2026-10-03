import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Configuração via variáveis públicas do Expo (EXPO_PUBLIC_*), lidas de `.env`.
 * (As chaves web do Firebase não são segredos — a proteção real está nas
 * Security Rules em `firestore.rules`.)
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCq2clCM2UMHBki3POW8ExQIh3A5wKgqiI',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'frojho.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'frojho',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'frojho.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1029343752086',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:1029343752086:web:3551e7509e2278702437b7',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function createApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

function createAuth(app: FirebaseApp): Auth {
  // Web / Node / SSR
  if (Platform.OS === 'web') {
    try {
      return getAuth(app);
    } catch {
      return initializeAuth(app);
    }
  }

  // React Native (iOS / Android) com persistência via AsyncStorage
  try {
    if (typeof getReactNativePersistence === 'function') {
      return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  } catch (error: any) {
    // Fast Refresh: Auth já foi inicializado anteriormente
    try {
      return getAuth(app);
    } catch {
      // Ignora e tenta fallback
    }
  }

  // Fallback seguro
  try {
    return getAuth(app);
  } catch {
    return initializeAuth(app);
  }
}

const databaseId = process.env.EXPO_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || 'frojho-deathdate';

export const app = createApp();
export const auth: Auth = createAuth(app);
export const db: Firestore = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

