import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home.jsx';
import { Play } from './play/play.jsx';
import { GameHistory } from './gamehistory/gamehistory.jsx';
import { About } from './about/about.jsx';
import { AuthState } from './home/authState.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    const [username, setUserName] = React.useState(localStorage.getItem('username') || '');
    const currentAuthState = username ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);


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
                </nav>
                <hr />
            </header>

            <div className="maincontents">
                <Routes>
                    <Route path="/" 
                        element={
                            <Home
                                username={username}
                                authState={authState}
                                onLogin={(loginUserName) => {
                                    console.log("onLogin: " + loginUserName);
                                }}
                                onAuthChange={(username, authState) => {
                                    setUserName(username);
                                    setAuthState(authState);
                                }}
                            />
                        }
                        exact
                    />
                    <Route path="/home"
                        element={
                            <Home
                                username={username}
                                authState={authState}
                                onLogin={(loginUserName) => {
                                    console.log("onLogin: " + loginUserName);
                                }}
                                onAuthChange={(username, authState) => {
                                    setUserName(username);
                                    setAuthState(authState);
                                }}
                            />
                        }
                    />
                    <Route path="/play" element={<Play />} />
                    <Route path="/gamehistory" element={<GameHistory />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>

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