import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

let env = import.meta.env;

const firebaseConfig = {
	apiKey: env.VITE_FB_API_KEY,
	authDomain: env.VITE_FB_AUTH_DOMAIN,
	projectId: env.VITE_FB_PROJECT_ID,
	storageBucket: env.VITE_FB_STORAGE_BUCKET,
	messagingSenderId: env.VITE_FB_MESSAGING_SENDER_ID,
	appId: env.VITE_FB_APP_ID,
	measurementId: env.VITE_FB_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const fb = firebase.firestore();
export const fbAuth = firebase.auth();
export const fbStorage = firebase.storage();
