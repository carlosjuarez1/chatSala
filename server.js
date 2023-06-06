const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { instrument } = require("@socket.io/admin-ui");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["https://admin.socket.io","http://localhost:4200"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

instrument(io, {
  auth: false,
  mode: "development",
});


// Manejo de conexiones de sockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Escucha el evento de unirse a una sala
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Usuario se unió a la sala ${room}`);
  });

  // Escucha el evento de abandonar una sala
  socket.on('leaveRoom', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
        console.log(`Usuario abandonó la sala ${room}`);
      }
    });
  });

  // Escucha el evento de dibujo
  socket.on('drawing', (data) => {
    // io.emit('drawing', data);
    io.to(data.room).emit('drawing', data.data);
  });

  // Escucha el evento de mensajes de chat
  socket.on('chatMessage', (data) => {
    if (data && data.room && data.message) {
      io.to(data.room).emit('chatMessage', { message: data.message });
    }
  });

  // Manejo de desconexiones de sockets
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
