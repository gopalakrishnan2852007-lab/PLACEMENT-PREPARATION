import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi5Lix6fw691yMD0nHan8M45Of1aTWKuE",
  authDomain: "placement-prep-d0aac.firebaseapp.com",
  projectId: "placement-prep-d0aac",
  storageBucket: "placement-prep-d0aac.firebasestorage.app",
  messagingSenderId: "1059727678529",
  appId: "1:1059727678529:web:852a9e3e04210e5f9bbac0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

export const updateStreakOnLoginFn = httpsCallable(functions, 'updateStreakOnLogin');
export const analyzeJDFn = httpsCallable(functions, 'analyzeJD');

// Helper to sync user to Firestore on login
export const syncUserToFirestore = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    lastLogin: new Date().toISOString(),
  }, { merge: true });
};

export { signInWithPopup, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword };
export type { User };
