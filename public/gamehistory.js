async function loadGames() {
    let gameHistory = [];
    try {
        const response = await fetch('/api/gameHistory');
        gameHistory = await response.json();

        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    } catch {
        console.log('Could not load game history');
        const gameHistoryText = localStorage.getItem('gameHistory');
        if (gameHistoryText) {
            gameHistory = JSON.parse(gameHistoryText);
        }
    }

    showGames(gameHistory);
}

function showGames(gameHistory) {
    const gameHistoryTable = document.getElementById('gameHistoryTable');

    console.log(gameHistory);

    //remove null items
    gameHistory = gameHistory.filter(game => game !== null);

    console.log(gameHistory);

    if (gameHistory.length === 0) {
        gameHistoryTable.innerHTML = '<tr><td colspan="3">No games played</td></tr>';
        return;
    }
    
    gameHistory.forEach(game => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${game.date}</td>
            <td>${game.versus}</td>
            <td>${game.winner}</td>
        `;
        gameHistoryTable.appendChild(row);
    });
}

loadGames();