import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className='body'>

        <header>
            <h1>Ultimate Tic-Tac-Toe<sup>&reg;</sup></h1>

            <nav>
                <menu>
                    <a href="index.html">Home</a>
                    <a href="play.html" class="active">Play</a>
                    <a href="gamehistory.html">Game Log</a>
                    <a href="about.html">About</a>
                </menu>
                <p id="playerName"></p>
                <p id="gameID"></p>
                <p id="playingAs"></p>
                <p id="playingFirst"></p>
                <p id="playerTurn"></p>
                <p id="opponentName"></p>
            </nav>
            <hr />
        </header>

            <main>App components go here</main>

        <footer>
            <div class="d-flex justify-content-end mx-2">
            <p>Made by</p>
            <div class="d-flex justify-content-end mx-1">
                <a href="https://github.com/AndrewTingey/CS260">Andrew Tingey</a>
            </div>
            </div>
        </footer>
    </div>
    )
}