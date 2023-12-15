import React from 'react';
import { useParams } from 'react-router-dom';

import { Gameboard, ChatBox } from './gameboard.jsx';
import { GameBoard } from './gameboard.js';

let gameBoard = new GameBoard();

export function Play(props) {
    const opponent = props.opponent;
    const { gameID } = useParams();
    console.log("Opponent: " + opponent);
    console.log("Game ID: " + gameID);
    gameBoard.setOpponentType("player"); //TODO get this from props

    return (
        <main>
            <h1 id="player-turn-label">
                Select a square to start the game!
            </h1>

            <Gameboard />

            <br />
            {opponent === "online" &&
                <ChatBox />
            }
        </main>
    );
}

export { gameBoard };