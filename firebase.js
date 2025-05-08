import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAxAiZbfcSanGNSJPyD3f-ggf5WJHkCXF8',
  authDomain: 'mawa-6f2ef.firebaseapp.com',
  projectId: 'mawa-6f2ef',
  storageBucket: 'mawa-6f2ef.firebasestorage.app',
  messagingSenderId: '215888482553',
  appId: '1:215888482553:web:6347ebf1a2fa9a21c3d228',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save score function
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

// Get leaderboard function
export async function getLeaderboard() {
  const q = query(
    collection(db, 'scores'),
    orderBy('score', 'desc'),
    limit(10)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
}
