import {gameBoard} from "./play.js";

export function getCPUMove() {
    let move;
    move = {I: 0, J: 0, i: 0, j: 0};

    //TODO
    //intellegent move by minimax
    let bestScore = -Infinity;
    let bestMove = {};
    for (let I = 0; I < 3; I++) {
        for (let J = 0; J < 3; J++) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard.validMove(I, J, i, j)) {
                        gameBoard.makeMove(I, J, i, j, 'X');
                        let score = minimax(gameBoard, 0, false);
                        gameBoard.makeMove(I, J, i, j, null);
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = {I, J, i, j};
                        }
                    }
                }
            }
        }
    }
    console.log("BestMove: ", bestMove);
    return bestMove;

    
    //not an inteligent move, just random I J, i, j
    // do {
    //     move.I = Math.floor(Math.random() * 3);
    //     move.J = Math.floor(Math.random() * 3);
    //     move.i = Math.floor(Math.random() * 3);
    //     move.j = Math.floor(Math.random() * 3);
    // } while (!gameBoard.validMove(move.I, move.J, move.i, move.j));
    // return move;
}

export function minimax(board, depth, isMaximizing) {
    let result = board.checkBigBoard();
    if (result !== null) {
        return result;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let I = 0; I < 3; I++) {
            for (let J = 0; J < 3; J++) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board.validMove(I, J, i, j)) {
                            board.makeMove(I, J, i, j, 'X');
                            let score = minimax(board, depth + 1, false);
                            board.makeMove(I, J, i, j, null);
                            bestScore = Math.max(score, bestScore);
                        }
                    }
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let I = 0; I < 3; I++) {
            for (let J = 0; J < 3; J++) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board.validMove(I, J, i, j)) {
                            board.makeMove(I, J, i, j, 'O');
                            let score = minimax(board, depth + 1, true);
                            board.makeMove(I, J, i, j, null);
                            bestScore = Math.min(score, bestScore);
                        }
                    }
                }
            }
        }
        return bestScore;
    }
}