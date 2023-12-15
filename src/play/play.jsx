import React from 'react';

import { Gameboard, ChatBox } from './gameboard.jsx';
import { GameBoard } from './gameboard.js';

let gameBoard = new GameBoard();

export function Play() {
    gameBoard.setOpponentType("player"); //TODO get this from props


    return (
        <main>
            <h1 id="player-turn-label">
                Select a square to start the game!
            </h1>

            <Gameboard />

            <br />
            <ChatBox />
        </main>
    );
}

export { gameBoard };