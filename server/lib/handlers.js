module.exports = (function (io) {
    users = []
    playersList = []

    createBlankObj = (player, oponent) => ({
        move: null,
        game_status: {
            board: null,
            turnsOf: player.name,
            gameFinished: false
        },
        player: player,
        oponent: oponent
    })

    onAddUser = socket => data => {

        let userObj = { name: data.user, id: socket.id }
        let new_name = data.user

        const matchednames = this.users.filter((elm) => elm.name === data.user);
        if (matchednames.length > 0) {
            new_name = data.user + Math.floor(Math.random() * 1000)
            socket.emit('err-add-user', {
                msg: 'Error while adding the user: Username already exists',
                suggestedname: new_name
            });
            userObj = { name: new_name, id: socket.id }
        }

        this.users.push(userObj)
        socket.username = new_name
        io.emit('add-user', this.users);
    }

    ondisconnect = socket => () => {
        console.log('disconnect ' + socket.id);

        this.users = this.users.filter(elm => elm.name !== socket.username)
        this.playersList = this.playersList
            .filter(elm =>
                elm.player.name !== socket.username &&
                elm.oponent.name !== socket.username)

        io.emit('disconncted', this.users);
    }

    onPlayerRequest = socket => data => {
        let player = this.users
            .filter(elm => elm.name === socket.username)
        let oponent = this.users
            .filter(elm => elm.name === data.user)

        const matchednames = this.playersList
            .filter(elm =>
                elm.player.name === oponent[0].name ||
                elm.oponent.name === oponent[0].name);

        if (matchednames.length === 0) {
            this.playersList.push({ player: player[0], oponent: oponent[0] })

            io.to(`${player[0].id}`).emit('game_started', createBlankObj(player[0], oponent[0]));
            io.to(`${oponent[0].id}`).emit('game_started', createBlankObj(oponent[0], player[0]));
        } else {
            io.to(`${player[0].id}`).emit('game_started_err', {
                msg: `Oponent already playing.`
            });
        }
    }

    onMovePlayed = socket => data => {
        io.to(`${data.oponent.id}`).emit('move_played', { ...data, byOponent: true });
        io.to(`${data.player.id}`).emit('move_played', { ...data, byOponent: false });
    }

    onMoveMade = socket => data => {
        io.to(`${data.oponent.id}`).emit('move_made', { ...data, byOponent: true });
        io.to(`${data.player.id}`).emit('move_made', { ...data, byOponent: false });
    }

    return {
        onAddUser,
        ondisconnect,
        onPlayerRequest,
        onMovePlayed,
        onMoveMade
    }
})