import { initializeApp, firebase } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

// add firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

// initialize firebase
initializeApp(firebaseConfig);

const db = getFirestore();

// initialize auth
const auth = getAuth();

export { auth, firebaseConfig, db };
