import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // URL del frontend
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Escucha eventos de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('send_message', (data) => {
    console.log(data);
    io.emit('receive_message', { ...data, userId: socket.id }); // Envíar el mensaje a todos los usuarios
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});