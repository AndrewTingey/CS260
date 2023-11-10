import {gameBoard} from "./play.js";

export function getCPUMove() {
    let move;
    move = {I: 0, J: 0, i: 0, j: 0};

    //TODO
    //not an inteligent move, just random I J, i, j
    do {
        move.I = Math.floor(Math.random() * 3);
        move.J = Math.floor(Math.random() * 3);
        move.i = Math.floor(Math.random() * 3);
        move.j = Math.floor(Math.random() * 3);
    } while (!gameBoard.validMove(move.I, move.J, move.i, move.j));
    return move;
}
