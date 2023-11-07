import { isValidMove } from './play.js';

export function getCPUMove() {
    let move;
    move = {I: 0, J: 0, i: 0, j: 0};

    //TODO
    //not an inteligent move, just the first valid move
    for (let I = 0; I < 3; I++) {
        for (let J = 0; J < 3; J++) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    move.I = I;
                    move.J = J;
                    move.i = i;
                    move.j = j;
                    if (isValidMove(move)) {
                        return move;
                    }
                }
            }
        }
    }
}
