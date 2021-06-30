let readyPlayerCount = 0;

function listen(io){
    const pongNamespace = io.of('/pong');
    
    pongNamespace.on('connection', (socket) => {
        let room;
        console.log('a user connected', socket.id);

        socket.on('ready', ()=>{
            room = 'room' + Math.floor(readyPlayerCount / 2);
            socket.join(room); // joining rooms

            console.log('Player ready', socket.id, room);

            readyPlayerCount++;

            if(readyPlayerCount % 2 === 0){
                // broadcast ('startGame') to all clients that connected to the room
                pongNamespace.in(room).emit('startGame', socket.id); // the second player is the referee (the source of truth of the data)
            }
        });

        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData); // broadcast except for the sender
        });

        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room); // socket.io does it automatically, here we explicitly tell it to do it.
        });
})
}

module.exports = {listen};