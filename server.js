const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const activeUsers = new Map();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (req, res) => res.json({ status: 'ok', activeUsers: activeUsers.size }));

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('join chat', (rawName) => {
    const name = String(rawName || '').trim().slice(0, 24);
    if (!name) return socket.emit('chat error', 'Please enter a name before joining.');
    if (activeUsers.has(socket.id)) return;

    activeUsers.set(socket.id, name);
    socket.emit('join success', { id: socket.id, name });
    socket.broadcast.emit('system message', `${name} joined the chat.`);
    io.emit('active users', Array.from(activeUsers.values()));
    console.log(`${name} joined`);
  });

  socket.on('chat message', (rawMessage) => {
    const name = activeUsers.get(socket.id);
    if (!name) return socket.emit('chat error', 'Join the chat before sending messages.');
    const message = String(rawMessage || '').trim().slice(0, 500);
    if (!message) return;
    io.emit('chat message', { name, message, timestamp: new Date().toISOString(), socketId: socket.id });
    console.log(`[message] ${name}: ${message}`);
  });

  socket.on('disconnect', (reason) => {
    const name = activeUsers.get(socket.id);
    if (name) {
      activeUsers.delete(socket.id);
      io.emit('system message', `${name} left the chat.`);
      io.emit('active users', Array.from(activeUsers.values()));
      console.log(`${name} disconnected: ${reason}`);
    } else console.log(`Disconnected: ${socket.id} (${reason})`);
  });

  socket.on('error', (err) => console.error(`Socket error: ${err.message}`));
});

server.listen(PORT, () => console.log(`Real-time chat server running at http://localhost:${PORT}`));
