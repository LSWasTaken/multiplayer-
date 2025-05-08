const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Update for production
    methods: ['GET', 'POST'],
  },
});

let players = [];

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  socket.on('joinGame', ({ playerName }) => {
    players.push({ id: socket.id, playerName, clicks: 0 });
    io.emit('updatePlayers', players);
  });

  socket.on('click', ({ playerId, clicks }) => {
    players = players.map((p) => (p.id === playerId ? { ...p, clicks } : p));
    io.emit('clickUpdate', { playerId, clicks });
    io.emit('updatePlayers', players);
  });

  socket.on('endGame', ({ playerName, clicks }) => {
    // Optionally handle end game logic
  });

  socket.on('disconnect', () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit('updatePlayers', players);
    console.log('Player disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
