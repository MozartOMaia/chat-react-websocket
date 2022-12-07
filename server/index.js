const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let users = [];

socketIO.on('connection', (socket) => {
    console.log(` 🟢 : ${socket.id} usuário acabou de conectar!`);

    socket.on('message', (data) => {
      // console.log(data); //descomente para ver as mensagens no log de console
      socketIO.emit('messageResponse', data);
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('newUser', (data) => {
      users.push(data);

      socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
      console.log('🔴: Usuário acabou de desconectar');

      users = users.filter((user) => user.socketID !== socket.id);
      //console.log(users);
      //Envia a lista de usuários para o cliente
      socketIO.emit('newUserResponse', users);
      socket.disconnect();
    });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
//   });