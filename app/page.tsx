'use client';

import { useState, useEffect } from 'react';
import { saveScore, getLeaderboard } from '../../firebase';
import Head from 'next/head';

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    let timer;
    if (isGameRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameRunning) {
      setIsGameRunning(false);
      if (playerName && clicks > 0) {
        saveScore(playerName, clicks);
        const fetchLeaderboard = async () => {
          const scores = await getLeaderboard();
          setLeaderboard(scores);
        };
        fetchLeaderboard();
      }
    }
    return () => clearInterval(timer);
  }, [isGameRunning, timeLeft, playerName, clicks]);

  const startGame = () => {
    if (!playerName) {
      alert('Please enter your name');
      return;
    }
    setClicks(0);
    setTimeLeft(30);
    setIsGameRunning(true);
  };

  const handleClick = () => {
    if (isGameRunning) {
      setClicks((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Tanza Fighters</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Tanza Fighters - Click to win!" />
      </Head>
      <h1 className="text-4xl font-bold mb-4 text-center">Tanza Fighters</h1>

      {!isGameRunning && !playerName && (
        <div className="mb-4 w-full max-w-xs">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={startGame}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        </div>
      )}

      {isGameRunning && (
        <div className="text-center">
          <p className="text-2xl mb-2">Time Left: {timeLeft}s</p>
          <p className="text-2xl mb-4">Clicks: {clicks}</p>
          <button
            onClick={handleClick}
            onTouchStart={handleClick}
            className="w-40 h-40 bg-red-500 text-white rounded-full text-2xl hover:bg-red-600 active:bg-red-700"
          >
            Click Me!
          </button>
        </div>
      )}

      {!isGameRunning && playerName && (
        <div className="text-center">
          <p className="text-2xl mb-4">Your Score: {clicks}</p>
          <button
            onClick={startGame}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
        <ul className="border rounded p-4 bg-white">
          {leaderboard.map((entry, index) => (
            <li key={index} className="py-1">
              {entry.playerName}: {entry.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
