/*
player = 1: Player 1
player = 2: Player 2
*/

const pattern = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
]

export class TicTacToe {
    rows = 3;
    cols = 3;
    blankCell = 0;
    turns = 0;
    player = 1;
    gameFinished = false;
    board = this.createBoard();

    constructor() { }

    createBoard() {
        let result = new Array(this.rows);
        for (let i = 0; i < result.length; i++) {
            result[i] = new Array(this.cols);
            for (let j = 0; j < result[i].length; j++) {
                result[i][j] = this.blankCell;
            }
        }
        return result;
    }

    changeMove() {
        this.turns += 1;
        if (this.turns % 2 === 0) {
            this.player = 1;
        } else {
            this.player = 2;
        }
    }

    updateBoard([rowIndex, colIndex]: number[] | null, board?: any) {
        if (board instanceof Array) {
            this.board = board;
            return true;
        }
        if (this.board[rowIndex][colIndex] === 0) {
            this.board[rowIndex][colIndex] = this.player;
            return true;
        }
        return false;
    }

    validateMove([rowIndex, colIndex]: number[]) {
        if (this.board[rowIndex][colIndex] === 0) {
            return true;
        }
        return false;
    }

    isWin() {
        for (let i = 0; i < pattern.length; i++) {
            let flag = true;
            for (let j = 0; j < pattern[i].length; j++) {
                let [rowI, colI] = pattern[i][j];

                if (this.board[rowI][colI] !== this.player) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                this.gameFinished = true;
                return true;
            }
        }
        return false;
    }

    isDraw() {
        if (this.isWin()) return false;

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        this.gameFinished = true;
        return true;
    }
}