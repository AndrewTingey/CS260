// import { getCPUMove } from './minimax.js';
// import { sendToWS, welcomeFromSystem } from './websocket.js';

export class GameBoard {
    //todo: check cpu/player/online are mutually exclusive
    constructor(VS_CPU = false, VS_PLAYER = true, ONLINE = false) {
        this.VS_CPU = VS_CPU;
        this.VS_PLAYER = VS_PLAYER;
        this.ONLINE = ONLINE;
        this.playerTurn = "X";
        this.userSymbol = "X";
        this.prevI = -1;
        this.prevJ = -1;
        this.previ = -1;
        this.prevj = -1;
        this.clickedI = 0;
        this.clickedJ = 0;
        this.clickedi = 0;   
        this.clickedj = 0;
        this.gameWinner = null;
        this.bigBoard = [];
        this.gameID = null;
        this.initialize();
        this.registerEventListeners();
    }

    initialize() {
        //get game if existing online game
        if (this.ONLINE) {
            this.gameID = localStorage.getItem("gameID");
            //get game details from server
            //WORKING HERE
            //set game detail
            //redraw board
        }


        //initialize full board if new game
        for (let i = 0; i < 3; i++) {
            this.bigBoard[i] = [];
            for (let j = 0; j < 3; j++) {
                this.bigBoard[i][j] = [];
                for (let k = 0; k < 3; k++) {
                    this.bigBoard[i][j][k] = [];
                    for (let l = 0; l < 3; l++) {
                        this.bigBoard[i][j][k][l] = "";
                    }
                }
            }
        }
    }

    async setOpponentType(opponent) {
        //TODO:
        //eventually we'll want to hard reset the gameboard
        if (opponent == "cpu") {
            // gameBoard = new GameBoard(true, false, false);
            this.VS_CPU = true;
            this.VS_PLAYER = false;
            this.ONLINE = false;
        } else if (opponent == "player") {
            this.VS_CPU = false;
            this.VS_PLAYER = true;
            this.ONLINE = false;
        } else if (opponent == "online") {
            this.VS_CPU = false;
            this.VS_PLAYER = false;
            this.ONLINE = true;
            this.gameID = localStorage.getItem("gameID");


            //set game detail WORKING HERE. setGameDetails somehow does it backwards
            //get gameDetails from server
            const response = await fetch(`/api/game/${this.gameID}`);
            const result = await response.json();
            console.log("Fetched game details: ", result);


            this.setGameDetail(result);
        } else {
            console.log("Error: invalid opponent type", opponent);
        }
    }

    setGameDetail(gameDetails) {
        console.log("Setting game details");
        
        const username = localStorage.getItem("username");
        const userPlayingFirst = gameDetails.playingFirst;
        let opponentName = null;

        if (gameDetails.playingAsO == username) {
            this.userSymbol = "O";
        } else if (gameDetails.playingAsO != null) {
            opponentName = gameDetails.playingAsO;
        }
        if (gameDetails.playingAsX == username) {
            this.userSymbol = "X";
        } else if (gameDetails.playingAsX != null) {
            opponentName = gameDetails.playingAsX;
        }

        //show gameID and username on screen
        document.getElementById("gameID").innerHTML = "Game ID: " + gameDetails.gameID;
        document.getElementById("playerName").innerHTML = "Username: " + username;
        document.getElementById("playingAs").innerHTML = "Playing as: " + this.userSymbol;
        //probably dont show these ones:
        document.getElementById("playingFirst").innerHTML = "Playing first: " + userPlayingFirst;
        document.getElementById("opponentName").innerHTML = "Opponent: " + opponentName;

        //set localStorage
        localStorage.setItem("playingAs", this.userSymbol);
        localStorage.setItem("playingFirst", gameDetails.playingFirst);

        //set turnlabel
        if (gameDetails.numberPlayers == 1) {
            document.getElementById("player-turn-label").innerHTML = "Waiting for an opponent to join\nGame ID: " + gameDetails.gameID;;
        } else if (gameDetails.numberPlayers == 2) {
            if (userPlayingFirst == username) {
                this.playerTurn = this.userSymbol;
                document.getElementById("playerTurn").innerHTML = this.playerTurn;
                document.getElementById("player-turn-label").innerHTML = "Select a square to start the game!";
            } else {
                this.playerTurn = this.toggleXO(this.userSymbol);
                document.getElementById("playerTurn").innerHTML = this.playerTurn;
                document.getElementById("player-turn-label").innerHTML = "Waiting for opponent to start the game";
            }
        } else {
            console.log("Error: invalid number of players: ", gameDetails.numberPlayers);
        }

        welcomeFromSystem(gameDetails);
    }

    redrawBoard() { //Haven't tested this
        //redraw board
        var largeTables = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board");
        for (var i = 0; i < largeTables.length; i++) {
            var smallCells = largeTables[i].getElementsByTagName("td");
            for (var j = 0; j < smallCells.length; j++) {
                smallCells[j].textContent = this.bigBoard[Math.floor(i/3)][i%3][Math.floor(j/3)][j%3];
                smallCells[j].style.color = "var(--text-color)";
                if (this.bigBoard[Math.floor(i/3)][i%3][Math.floor(j/3)][j%3] != "") {
                    smallCells[j].style.cursor = "not-allowed";
                } else {
                    smallCells[j].style.cursor = "pointer";
                }
            }
        }
        this.highlightBoard();
    }

    updateBoard(bigI, bigJ, lili, lilj) {
        var cellContext = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board")[bigI*3+bigJ].getElementsByTagName("td")[lili*3+lilj];
        cellContext.textContent = this.playerTurn;
        cellContext.style.color = "var(--text-color)";
        this.bigBoard[bigI][bigJ][lili][lilj] = this.playerTurn;
        this.previ = lili;
        this.prevj = lilj;
        this.prevI = bigI;
        this.prevJ = bigJ;
        let localWinner = this.checkWinner(this.bigBoard[bigI][bigJ]);
        if(localWinner != null) {
            var largeTable = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board")[bigI*3+bigJ];
            largeTable.textContent = localWinner;
            largeTable.style.fontSize = "100px";
        }
    }

    drawPrevMove() {
        var cellContext = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board")[this.prevI*3+this.prevJ].getElementsByTagName("td")[this.previ*3+this.prevj];
        cellContext.textContent = this.toggleXO(this.playerTurn); //previous move, not this move
        cellContext.style.color = "var(--text-color)";
        this.bigBoard[this.prevI][this.prevJ][this.previ][this.prevj] = this.toggleXO(this.playerTurn);
        let localWinner = this.checkWinner(this.bigBoard[this.prevI][this.prevJ]);
        if(localWinner != null) {
            var largeTable = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board")[this.prevI*3+this.prevJ];
            largeTable.textContent = localWinner;
            largeTable.style.fontSize = "100px";
        }
        //update turn label
        if(this.gameWinner != null) {
            this.handleWinner(this.gameWinner);
        } else {
            document.getElementById("player-turn-label").innerHTML = this.playerTurn + "'s turn";
        }
    }

    validMove(bigI, bigJ, lili, lilj) {
        //game is over
        if (this.gameWinner != null) {
            return false;
        }

        //not user's turn
        if (this.playerTurn != this.userSymbol) {
            return false;
        }

        //space is playable
        if (this.bigBoard[bigI][bigJ][lili][lilj] == "") {
            //first move is always good
            if (this.previ == -1 && this.prevj == -1) {
                return true;
            }
            //box is already won
            else if (this.checkWinner(this.bigBoard[bigI][bigJ]) != null) {
                return false;
            } 
            //last sent to completed box, any open space is playable
            else if (this.checkWinner(this.bigBoard[this.previ][this.prevj]) != null) {
                return true;
            } 
            //otherwise, must play in restricted box
            else if (bigI == this.previ && bigJ == this.prevj) {
                return true;
            }
        }
        return false;
    }

    //used for minimax, not user input
    minimaxValidMove(bigI, bigJ, lili, lilj) {
        //game is over
        if (this.gameWinner != null) {
            return false;
        }

        //space is playable
        if (this.bigBoard[bigI][bigJ][lili][lilj] == "") {
            //first move is always good
            if (this.previ == -1 && this.prevj == -1) {
                return true;
            }
            //box is already won
            else if (this.checkWinner(this.bigBoard[bigI][bigJ]) != null) {
                return false;
            } 
            //last sent to completed box, any open space is playable
            else if (this.checkWinner(this.bigBoard[this.previ][this.prevj]) != null) {
                return true;
            } 
            //otherwise, must play in restricted box
            else if (bigI == this.previ && bigJ == this.prevj) {
                return true;
            }
        }
        return false;
    }

    //used for minimax, not for user input
    makeMove(bigI, bigJ, lili, lilj, player) {
        this.bigBoard[bigI][bigJ][lili][lilj] = player;
    }

    async nextTurn() {
        //check for game winner
        const result = this.checkBigBoard();
        
        //theres a winner!
        if (result != null) {
            this.handleWinner(result);
            return;
        }

        //toggle turn
        if (this.VS_PLAYER) {
            this.playerTurn = this.toggleXO(this.playerTurn);
            this.userSymbol = this.playerTurn;
            document.getElementById("playerTurn").innerHTML = this.playerTurn;
            document.getElementById("player-turn-label").innerHTML = this.playerTurn + "'s turn";
            this.highlightBoard();
        } else if (this.VS_CPU) {
            this.playerTurn = this.toggleXO(this.playerTurn);
            document.getElementById("playerTurn").innerHTML = this.playerTurn;
            document.getElementById("player-turn-label").innerHTML = "CPU's turn";
            this.highlightBoard();
            var move;
            //timeout isnt really needed
            //but it makes it look like the CPU is thinking
            setTimeout(() => {
                //get and make cpu move
                move = getCPUMove();
                this.updateBoard(move.I, move.J, move.i, move.j);

                //update turn
                this.playerTurn = this.toggleXO(this.playerTurn);
                document.getElementById("playerTurn").innerHTML = this.playerTurn;
                document.getElementById("player-turn-label").innerHTML = this.playerTurn + "'s turn";
                this.highlightBoard();
            }, 1000);
        } else if (this.ONLINE) {
            //send move
            this.playerTurn = this.toggleXO(this.playerTurn);
            console.log("Player ", this.userSymbol, " sent move. Now its ", this.playerTurn, "'s turn");
            await this.sendMove(this.getGameState());
            document.getElementById("playerTurn").innerHTML = this.playerTurn;
            document.getElementById("player-turn-label").innerHTML = "Waiting for opponent";
            this.highlightBoard();
        }
    }

    toggleXO(val) {
        if (val == "X") {
            return "O";
        } else if (val == "O") {
            return "X";
        }
    }

    equals3(a, b, c) {
        return a == b && b == c && a != '';
    }

    is_full(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    return false;
                }
            }
        }
        return true;
    }

    highlightBoard() {
        const largeTables = document.querySelectorAll(".outer-table .big-board");
        const highlightColor = "var(--highlight-color)";
        const backgroundColor = "var(--background-color)";
        const borderRadius = "15px";

        //unhighlight all boards
        largeTables.forEach(table => {
            table.style.backgroundColor = backgroundColor;
            table.style.borderRadius = borderRadius;
        });

        //if game is over, don't highlight anything
        if (this.gameWinner != null) {
            return;
        }
        //highlight playable board
        const index = this.previ * 3 + this.prevj;
        largeTables[index].style.backgroundColor = highlightColor;
        //if user can go anywhere
        if (this.checkWinner(this.bigBoard[this.previ][this.prevj]) != null) {
            //highlight all boards
            largeTables.forEach(table => {
                table.style.backgroundColor = highlightColor;
            });
        }
    }

    checkWinner(board) {
        let winner = null;

        // horizontal
        for (let i = 0; i < 3; i++) {
            if (this.equals3(board[i][0], board[i][1], board[i][2])) {
                winner = board[i][0];
            }
        }
        // Vertical
        for (let i = 0; i < 3; i++) {
            if (this.equals3(board[0][i], board[1][i], board[2][i])) {
                winner = board[0][i];
            }
        }
        // Diagonal
        if (this.equals3(board[0][0], board[1][1], board[2][2])) {
            winner = board[0][0];
        }
        if (this.equals3(board[2][0], board[1][1], board[0][2])) {
            winner = board[2][0];
        }
        if (winner == null && this.is_full(board)) {
            winner = 'tie';
        } 
        return winner;
    }

    checkBigBoard() {
        var tempBoard = [
            ["","",""],
            ["","",""],
            ["","",""],
        ];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let result = this.checkWinner(this.bigBoard[i][j])
                if (result != null) {
                    tempBoard[i][j] = result;
                }
            }
        }
        this.gameWinner = this.checkWinner(tempBoard);
        //if game is over, unhighlight board
        if (this.gameWinner != null) {  
            this.highlightBoard();
        }
        return this.gameWinner;
    }

    async handleWinner(winner) {
        //update turn label
        document.getElementById("player-turn-label").innerHTML = winner + " wins!";
        document.getElementById("player-turn-label").style.display = "block";

        if (this.ONLINE) {
            this.playerTurn = this.toggleXO(this.playerTurn);
            await this.sendMove(this.getGameState());
        }
        //update game history
        await this.saveGameHistory(winner);
    }

    registerEventListeners() {
        var small_tables = document.querySelectorAll(".inner-table");
        for (var i = 0; i < small_tables.length; i++) {
            var small_cells = small_tables[i].getElementsByTagName("td");
            for (var j = 0; j < small_cells.length; j++) {
                small_cells[j].addEventListener("click", cellClickedEventListener());
                small_cells[j].addEventListener("mouseover", cellHoverEventListener());
                small_cells[j].addEventListener("mouseout", cellMouseOutEventListener());
            }
        }
    }

    getGameState() {
        return {
            bigBoard: this.bigBoard,
            playerTurn: this.playerTurn,
            prevI: this.prevI,
            prevJ: this.prevJ,
            previ: this.previ,
            prevj: this.prevj,
            gameWinner: this.gameWinner
        };
    }

    setGameState(gameState) {
        this.bigBoard = gameState.bigBoard;
        this.playerTurn = gameState.playerTurn;
        this.prevI = gameState.prevI;
        this.prevJ = gameState.prevJ;
        this.previ = gameState.previ;
        this.prevj = gameState.prevj;
        this.gameWinner = gameState.gameWinner;
        document.getElementById("playerTurn").innerHTML = this.playerTurn;
    }

    async sendMove(gameState) {
        sendToWS(gameState); //using ws.js:sendMove()
    }

    async saveGameHistory(winner) {
        var versus;
        var resultLabel;
        if (this.VS_CPU) {
            versus = 'Computer';
            if (this.userSymbol == resultLabel) {
                resultLabel = 'You';
            } else {
                resultLabel = 'Computer';
            }
        } else if (this.VS_PLAYER) {
            versus = 'Local Multiplayer';
            resultLabel = winner + "'s";
        } else if (this.ONLINE) {
            versus = localStorage.getItem("opponentName");
            if (this.userSymbol == winner) {
                resultLabel = winner + "'s (You)";
            } else {
                resultLabel = winner + "'s (" + versus + ")";
            }
        }
        const game = {
            date: new Date().toDateString(),
            versus: versus,
            winner: resultLabel
        };
        console.log("Game to be saved: \n\t" + JSON.stringify(game));
        try {
            const response = await fetch('/api/gameHistory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });
            const data = await response.json();
            console.log("Data recieved: \n\t" + data);
            localStorage.setItem('gameHistory', JSON.stringify(data));
        } catch (error) {
            this.updateGamesLocal(game);
            updateGamesLocal = (game) => {
                const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
                gameHistory.push(game);
                localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
            }
            console.error(error);
        }
    }

    async deleteGame() {
        try {
            const response = await fetch('/api/game/' + this.gameID, {
                method: 'DELETE',
            });
            const data = await response.json();
            console.log("Data recieved: \n\t" + JSON.stringify(data));
        } catch (error) {
            console.error(error);
        }
    }
}


function cellClickedEventListener() {
    return function() {
        var clickedI = this.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex;
        var clickedJ = this.parentNode.parentNode.parentNode.parentNode.cellIndex;
        var clickedi = this.parentNode.rowIndex;
        var clickedj = this.cellIndex;
        //console.log("I: " + clickedI + "\nJ: " + clickedJ + "\ni: " + clickedi + "\nj: " + clickedj);
        if (gameBoard.validMove(clickedI, clickedJ, clickedi, clickedj)) {
            gameBoard.updateBoard(clickedI, clickedJ, clickedi, clickedj);    
            gameBoard.nextTurn();
        }
        return;
    }
}

function cellHoverEventListener() {
    return function() {
        //this event listener is not added to larger boards that have already been won.
        if (gameBoard.validMove(this.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex, this.parentNode.parentNode.parentNode.parentNode.cellIndex, this.parentNode.rowIndex, this.cellIndex)) {
            this.textContent = gameBoard.playerTurn;
            this.style.color = "lightgray";
            this.style.cursor = "pointer";
        } else {
            this.style.cursor = "not-allowed";
        }
    }
}

function cellMouseOutEventListener() {
    return function() {
        if (this.style.color == "lightgray") {
            // remove the text content only if the cell is not already filled with a player's move
            this.textContent = "";
        }
    }
}