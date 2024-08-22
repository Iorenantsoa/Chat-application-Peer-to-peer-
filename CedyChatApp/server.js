const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors middleware
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow access from Project 1
    methods: ["GET", "POST"]
  }
});

app.use(cors()); // Enable CORS for all routes

app.use(express.static('scripts'));

// Use session middleware
app.use(session({
  secret: '$ecRetKey1',
  resave: false,
  saveUninitialized: true
}));

// Use bodyParser middleware to parse POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check if user is authenticated
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Serve login.html file
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  // get the hash of password
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  // Check username and password
  if (username == 'cedy' && hashedPassword == '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08') {
    req.session.user = username; // Store user session
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

// Serve HTML file
app.get('/', requireLogin,(req, res) => {
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
