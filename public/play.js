import { getCPUMove } from './minimax.js';

class GameBoard {
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
        this.initialize();
    }

    initialize() {
        //initialize full board
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

    setOpponentType(opponent) {
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
        }
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

    validMove(bigI, bigJ, lili, lilj) {
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

    async nextTurn() {
        //check for game winner
        var result = this.checkBigBoard();
        
        //theres a winner!
        if (result != null) {
            //update turn label
            document.getElementById("player-turn-label").innerHTML = result + " wins!";
            document.getElementById("player-turn-label").style.display = "block";

            //update game history
            await this.saveGameHistory(result);
            return;
        }

        //toggle turn
        if (this.VS_CPU) {
            this.playerTurn = this.toggleXO(this.playerTurn);
            document.getElementById("player-turn-label").innerHTML = "CPU's turn";
            this.highlightBoard();
            var move;
            //timeout isnt really needed
            //but it makes it look like the CPU is thinking
            setTimeout(() => {
                //get and make cpu move
                move = getCPUMove();
                this.updateBoard(move.I, move.J, move.i, move.j);

                this.playerTurn = this.toggleXO(this.playerTurn);
                document.getElementById("player-turn-label").innerHTML = this.playerTurn + "'s turn";
                this.highlightBoard();
            }, 1000);
        } else {
            this.playerTurn = this.toggleXO(this.playerTurn);

            document.getElementById("player-turn-label").innerHTML = this.playerTurn + "'s turn";
            this.highlightBoard();
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

    async saveGameHistory(winner) {
        const game = {
            date: new Date().toDateString(),
            versus: this.VS_CPU ? 'Computer' : 'Local Multiplayer',
            winner: winner + "'s"
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
            console.error(error);
        }
    }

    updateGamesLocal(game) {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        gameHistory.push(game);
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
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
}

function isValidMove(move) {
    return gameBoard.validMove(move.I, move.J, move.i, move.j);
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

function setOpponent() {
    var opponent = document.getElementsByClassName("opponent");
    for (let i = 0; i < opponent.length; i++) {
        opponent[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("opponent active");
            for (let j = 0; j < current.length; j++) {
                current[j].classList.remove("active");
            }
            this.classList.add("active");
            gameBoard.setOpponentType(this.id);
        });
    }
}


let gameBoard = new GameBoard();
gameBoard.registerEventListeners();
setOpponent();

export {
    gameBoard
}