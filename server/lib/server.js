const server = require('http').createServer();
const io = require('socket.io')(server, {
    serveClient: false,
    wsEngine: 'ws'
})
const handler = require('./handlers')(io)

const port = process.env.PORT || 3000;

server.listen(port, () => console.log('server listening on port ' + port));

io.on('connect', socket => {
    console.log('connect ' + socket.id);
    socket.on('add-user', data => handler.onAddUser(socket)(data))
    socket.on('play', data => handler.onPlayerRequest(socket)(data))
    socket.on('move_played', data => handler.onMovePlayed(socket)(data))
    socket.on('move_made', data => handler.onMoveMade(socket)(data))
    socket.on('disconnect', () => handler.ondisconnect(socket)());
});