import { TicTacToe } from './tictactoe'
import { SocketIO } from './socketio'

export class UI {
    socket: SocketIO;
    username: string;

    constructor(socket: SocketIO) {
        this.socket = socket;
    }

    render(data: any, element: HTMLDivElement, reducer: any) {
        if (data instanceof Array) {
            element.innerHTML = data.reduce(reducer, '');
        } else {
            element.innerHTML = reducer
        }
    }

    renderOnlinePlayers(data: any[]) {
        const btnClassName = 'playBtn'

        this.render(
            data.length,
            document.querySelector('#online_number'),
            `Number of players online: ${data.length}`
        )

        this.render(
            data,
            document.querySelector('#online_players'),
            (acc: any, curr: any) =>
                acc + `<li class="list-group-item"><div><p>${curr.name === this.username ? 'You' : curr.name}</p><button class="${btnClassName} btn btn-success" id="${curr.name}" ${curr.name === this.username ? 'disabled' : ''}>Play</button></div></li>`
        )

        document.querySelectorAll(`.${btnClassName}`).forEach(elm => {
            elm.addEventListener('click', () => {
                this.socket.emit('play', { user: elm.id })
            })
        })
    }

    submitEventListener(form_element: HTMLFormElement) {
        form_element.addEventListener('submit', e => {
            e.preventDefault();

            const form_data: FormData = new FormData(form_element)
            const user: FormDataEntryValue = form_data.get('user')

            if (user) {
                this.username = user.toString();
                this.socket.emit('add-user', { user })
                this.socket.receive('add-user', (data: any) => this.renderOnlinePlayers(data));
                this.socket.receive('err-add-user', (data: any) => {
                    alert(data.msg)
                    this.username = data.suggestedname;
                })
            }
            form_element.reset()
        })
    }
}

export class Game extends UI {
    board = document.querySelector('#board')
    cells: any = [];
    t = new TicTacToe();
    oponent: any;
    player: any;
    gamePaused = true;

    constructor(socket: SocketIO) {
        super(socket);
    }

    start() {
        this.gamePaused = false
    }

    pause() {
        this.gamePaused = true
    }

    createBoard(player: any, oponent: any) {
        this.player = player
        this.oponent = oponent
        for (let i: number = 0; i < 3; i++) {
            for (let j: number = 0; j < 3; j++) {
                let cell = document.createElement('div');

                cell.setAttribute('class', 'cell')
                cell.setAttribute('id', (j + i * 3).toString())
                cell.addEventListener('click', (e: any) => this.clicked(e))

                this.board.appendChild(cell);
                this.cells.push(cell)
            }
        }
    }

    clicked(e: any) {
        if (this.gamePaused) {
            return;
        }
        if (this.t.gameFinished) {
            return;
        }
        const index = e.target.id;
        const rowI = Math.floor(index / 3);
        const colI = Math.floor(index % 3);
        this.validatemove([rowI, colI]);
    }

    validatemove(move: number[]) {
        if (this.t.validateMove(move)) {

            this.t.updateBoard(move)
            this.socket.emit('move_played', {
                move: move,
                game_status: {
                    board: this.t.board,
                    turnsOf: this.oponent.name,
                    gameFinished: this.t.gameFinished
                },
                player: this.player,
                oponent: this.oponent
            })
            this.pause();
        }
    }

    markBoard([rowIndex, colIndex]: number[], byOponent: boolean, board: any) {
        let index = rowIndex * 3 + colIndex
        let cell = this.cells[index]

        this.t.updateBoard([0, 0], board);

        if (byOponent) {
            console.log(`Turn of ${this.player.name}`)
            cell.innerHTML = this.oponent.name

            if (this.t.isWin()) {
                console.log(`${this.oponent.name} wins`)
            }
            if (this.t.isDraw()) {
                console.log(`Match is draw`)
            }
        } else {
            console.log(`Turn of ${this.oponent.name}`)
            cell.innerHTML = this.player.name

            if (this.t.isWin()) {
                console.log(`${this.player.name} wins`)
            }
            if (this.t.isDraw()) {
                console.log(`Match is draw`)
            }
        }
        this.t.changeMove();
        if (!byOponent) {
            this.socket.emit('move_made', {
                move: null,
                game_status: {
                    board: null,
                    turnsOf: this.oponent.name,
                    gameFinished: this.t.gameFinished
                },
                player: this.player,
                oponent: this.oponent
            })
        }

    }
}