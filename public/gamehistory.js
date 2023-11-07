function loadGames() {
    let gameHistory = [];
    const gameHistoryText = localStorage.getItem('gameHistory');
    if (gameHistoryText) {
        gameHistory = JSON.parse(gameHistoryText);
    }

    const gameHistoryElement = document.querySelector("#game-history");

    if (gameHistory.length == 0) {
        gameHistoryElement.innerHTML = "No games played yet.";
    } else {

        //TODO implement this 
        gameHistoryElement.innerHTML = "";
        for (let i = 0; i < gameHistory.length; i++) {
            const game = gameHistory[i];
            const gameElement = document.createElement("tr");

            const dateTdEl = document.createElement("td");
            const player2TdEl = document.createElement("td");
            const winnerTdEl = document.createElement("td");

            dateTdEl.innerHTML = game.date;
            player2TdEl.innerHTML = game.player2;
            winnerTdEl.innerHTML = game.winner;

            gameElement.appendChild(game.date);
            gameElement.appendChild(game.player2);
            gameElement.appendChild(game.winner);

            gameHistoryElement.appendChild(gameElement);
        }
    }
}

loadGames();