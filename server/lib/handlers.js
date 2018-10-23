module.exports = (function (io) {
    users = []
    playersList = []

    onAddUser = socket => data => {
        // console.log(this.users, data.user, this.users.includes(data.user))
        const matchednames = this.users.filter((elm) => elm.name === data.user);
        if (matchednames.length === 0) {
            this.users.push({ name: data.user, id: socket.id })
            io.emit('add-user', this.users);
            socket.username = data.user
        } else {
            const new_name = data.user + Math.floor(Math.random() * 1000)
            socket.emit('err-add-user', {
                msg: 'Error while adding the user: Username already exists',
                suggestedname: new_name
            });
            this.users.push({ name: new_name, id: socket.id })
            io.emit('add-user', this.users);
            socket.username = new_name
        }
    }

    ondisconnect = socket => () => {
        console.log('disconnect ' + socket.id);
        if (socket.username !== undefined) {
            for (let i = this.users.length - 1; i >= 0; i--) {
                if (this.users[i].name === socket.username) {
                    users.splice(i, 1)
                }
            }

            for (let i = this.playersList.length - 1; i >= 0; i--) {
                if (this.playersList[i].player.name === socket.username ||
                    this.playersList[i].oponent.name === socket.username) {
                    playersList.splice(i, 1)
                }
            }


            io.emit('disconncted', this.users);
        }
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

            io.to(`${player[0].id}`).emit('game_started', {
                move: null,
                game_status: {
                    board: null,
                    turnsOf: player[0].name,
                    gameFinished: false
                },
                player: player[0],
                oponent: oponent[0]
            });

            io.to(`${oponent[0].id}`).emit('game_started', {
                move: null,
                game_status: {
                    board: null,
                    turnsOf: player[0].name,
                    gameFinished: false
                },
                player: oponent[0],
                oponent: player[0]
            });
        } else {
            io.to(`${player[0].id}`).emit('game_started_err', {
                msg: `Oponent already playing.`
            });
        }

        // Private message
        // io.to(`${socketId}`).emit('hey', 'I just met you');
    }

    onMovePlayed = socket => data => {
        io.to(`${data.oponent.id}`).emit('move_played', {
            move: data.move,
            game_status: {
                board: data.game_status.board,
                turnsOf: data.game_status.turnsOf,
                gameFinished: data.game_status.gameFinished
            },
            player: data.player,
            oponent: data.oponent,
            byOponent: true
        });

        io.to(`${data.player.id}`).emit('move_played', {
            move: data.move,
            game_status: {
                board: data.game_status.board,
                turnsOf: data.game_status.turnsOf,
                gameFinished: data.game_status.gameFinished
            },
            player: data.player,
            oponent: data.oponent,
            byOponent: false
        });
    }

    onMoveMade = socket => data => {
        // console.log('MOVE_PLAYED:\n', JSON.stringify(data, null, 2))
        io.to(`${data.oponent.id}`).emit('move_made', {
            move: data.move,
            game_status: {
                board: data.game_status.board,
                turnsOf: data.game_status.turnsOf,
                gameFinished: data.game_status.gameFinished
            },
            player: data.player,
            oponent: data.oponent,
            byOponent: true
        });

        io.to(`${data.player.id}`).emit('move_made', {
            move: data.move,
            game_status: {
                board: data.game_status.board,
                turnsOf: data.game_status.turnsOf,
                gameFinished: data.game_status.gameFinished
            },
            player: data.player,
            oponent: data.oponent,
            byOponent: false
        });
    }

    return {
        onAddUser,
        ondisconnect,
        onPlayerRequest,
        onMovePlayed,
        onMoveMade
    }
})