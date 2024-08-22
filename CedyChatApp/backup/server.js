// Project 2: server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow access from Project 1
    methods: ["GET", "POST"]
  }
});

app.use(cors()); // Enable CORS for all routes

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('User connected on port 4000');

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('received_message', data); // Broadcast message to all clients
  });

  // image reception
  socket.on('image', (data) => {
    console.log('Image received: ',data);
    io.emit('received_image', { image: data.image, sender: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
