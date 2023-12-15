import React from 'react';

export function GameHistory() {
    let gameHistory = [];
    loadGames().then((games) => {
        gameHistory = games;
        console.log("GameHistory: ", gameHistory);
    }).catch((error) => {
        console.log("Error loading game history: ", error);
    });

    return (
        <main className='container-fluid'>
            <table className="table table-striped table-hover smaller-font">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Versus</th>
                        <th scope="col">Result</th>
                    </tr>
                </thead>
                <tbody id="gameHistoryTable">
                    {gameHistory.length === 0 ? (
                        <tr>
                            <td colSpan="3">No games have been played</td>
                        </tr>
                    ) : (
                        gameHistory.map((game, index) => (
                            <tr key={index}>
                                <td scope="row">{game.date}</td>
                                <td>{game.versus}</td>
                                <td>{game.result}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </main>
    )
}

async function loadGames() {
    let games = [];
    try {
        const response = await fetch('/api/gameHistory');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            games.push(data[i].game);
        }
        console.log('Game History Loaded');
        return games;
    } catch (error) {
        console.log('Could not load game history');
        throw error;
    }
}