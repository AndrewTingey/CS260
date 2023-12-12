import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { GameHistory } from './gamehistory.jsx';
import { About } from './about.jsx';
import { Play } from './play.jsx';
import { Home } from './home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className='body'>

        <header>
            <h1>Ultimate Tic-Tac-Toe<sup>&reg;</sup></h1>

            <nav>
                <menu>
                    <NavLink className="nav-link" to="/home">Home</NavLink>
                    <NavLink className="nav-link" to="/play">Play</NavLink>
                    <NavLink className="nav-link" to="/gamehistory">Game Log</NavLink>
                    <NavLink className="nav-link" to="/about">About</NavLink>
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

        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/gamehistory" element={<GameHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Routes>

        <footer>
            <div className="d-flex justify-content-end mx-2">
            <p>Made by</p>
            <div className="d-flex justify-content-end mx-1">
                <a href="https://github.com/AndrewTingey/CS260">Andrew Tingey</a>
            </div>
            </div>
        </footer>
    </div>
    )
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
  }