import React, { useState } from 'react';

import './about.css';

export function About() {
    const [joke, setJoke] = useState('');

    function newJoke() {
        fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => setJoke(data.joke))
            .catch((error) => {
                console.log("Error getting joke: ", error);
            });
    }

    return (
        <main className='container-fluid'>
            <div id="picture" className="picture-box">
                <img width="400px" src="https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="random" />
            </div>

            <p className="quote-box fly-in">
                Ultimate Tic-Tac-Toe is a interesting twist on a simple game about X's and O's. The object of the game is still
                to complete 3 in a row, but within each box there is another game of Tic-Tac-Toe. The player must win 3 games in a row to win!
            </p>

            <p className="quote-box fly-in">
                The game is played on a 3x3 grid of 3x3 grids. The first player can place their mark anywhere on the board.
                The next player must then place their mark in the grid that corresponds to the location of the previous player's mark.
                For example, if the first player places their mark in the top right corner of the center grid, the next player must place their mark in the top right grid.
            </p>

            <div className="quote" id="quote">
                <div>Tic-Tac-Toe is too easy.</div>
                <div className="author">Andrew Tingey</div>
            </div>

            <br />
            <button className="btn btn-primary mx-4" onClick={newJoke}>Tell me a joke.</button>

            {joke && (
                <div id="joke" className={`joke-box fly-in`}>
                    {joke}
                </div>
            )}
        </main>
    )
}