import { SocketIO } from './socketio'
import { Game, UI } from './web'
import '../scss/main.scss'

const socket = new SocketIO('http://localhost:3000')
// const ui = new UI(socket)
const g = new Game(socket)

socket.connect()

socket.receive('disconncted', (data: any) => g.renderOnlinePlayers(data));

socket.receive('game_started', (data: any) => {
    console.log("Game started:")
    g.createBoard(data.player, data.oponent)

    if (g.username === data.game_status.turnsOf) {
        g.start();
    }
});

socket.receive('move_made', (data: any) => {
    if (g.username === data.game_status.turnsOf) {
        g.start();
    }
});

socket.receive('game_started_err', (data: any) => console.log("Game started error: ", data.msg));

socket.receive('move_played', (data: any) => {
    let board = data.game_status.board
    g.markBoard(data.move, data.byOponent, board)
});

g.submitEventListener(document.querySelector('form'))