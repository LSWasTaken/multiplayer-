import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAxAiZbfcSanGNSJPyD3f-ggf5WJHkCXF8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mawa-6f2ef.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mawa-6f2ef",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mawa-6f2ef.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "215888482553",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:215888482553:web:6347ebf1a2fa9a21c3d228"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveScore(playerName, score) {
  try {
    await addDoc(collection(db, 'scores'), {
      playerName,
      score,
      timestamp: new Date(),
    });
  } catch (e) {
    console.error('Error adding score: ', e);
  }
}

export async function getLeaderboard() {
  const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}