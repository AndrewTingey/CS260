async function loadGames() {
    let gameHistory = [];
    try {
        const response = await fetch('/api/gameHistory');
        const responseJson = await response.json();
        for (let i = 0; i < responseJson.length; i++) {
            gameHistory.push(responseJson[i].game);
        }
        // gameHistory = await response.json();

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

    console.log("Game History to display", gameHistory);

    //remove null items
    gameHistory = gameHistory.filter(game => game !== null);
    //remove undefined items
    gameHistory = gameHistory.filter(game => game.date !== undefined);

    if (gameHistory.length === 0) {
        gameHistoryTable.innerHTML = '<tr><td colspan="3">No games played</td></tr>';
        return;
    } else {
        gameHistoryTable.innerHTML = '';
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

function clearGameHistory() {
    fetch('/api/gameHistory', { method: 'DELETE' })
        .then(response => response.json())
        .then(result => {
            console.log('Game history cleared', result);
            localStorage.setItem('gameHistory', JSON.stringify([]));
            showGames([]);
        })
        .catch(error => console.log('Error clearing game history', error));
}

loadGames();