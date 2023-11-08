import { getCPUMove } from './minimax.js';

const VS_CPU = true;
 
var playerTurn = "X";
var prevI = -1;
var prevJ = -1;
var previ = -1;
var prevj = -1;
var clickedI = 0;
var clickedJ = 0;
var clickedi = 0;   
var clickedj = 0;
var gameWinner = null;
let bigBoard = [];

function initialize() {
    //initialize full board
    for (let i = 0; i < 3; i++) {
        bigBoard[i] = [];
        for (let j = 0; j < 3; j++) {
            bigBoard[i][j] = [];
            for (let k = 0; k < 3; k++) {
                bigBoard[i][j][k] = [];
                for (let l = 0; l < 3; l++) {
                    bigBoard[i][j][k][l] = "";
                }
            }
        }
    }
    
    //table event listeners
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


function cellClickedEventListener() {
    return function() {
        clickedI = this.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex;
        clickedJ = this.parentNode.parentNode.parentNode.parentNode.cellIndex;
        clickedi = this.parentNode.rowIndex;
        clickedj = this.cellIndex;
        //console.log("I: " + clickedI + "\nJ: " + clickedJ + "\ni: " + clickedi + "\nj: " + clickedj);
        if (validMove(clickedI, clickedJ, clickedi, clickedj)) {
            updateBoard(clickedI, clickedJ, clickedi, clickedj);    
            nextTurn();
        }
        return;
    }
}

function cellHoverEventListener() {
    return function() {
        //this event listener is not added to larger boards that have already been won.
        if (validMove(this.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex, this.parentNode.parentNode.parentNode.parentNode.cellIndex, this.parentNode.rowIndex, this.cellIndex)) {
            this.textContent = playerTurn;
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

function updateBoard(bigI, bigJ, lili, lilj) {
    var cellContext = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board")[bigI*3+bigJ].getElementsByTagName("td")[lili*3+lilj];
    cellContext.textContent = playerTurn;
    cellContext.style.color = "var(--text-color)";
    bigBoard[bigI][bigJ][lili][lilj] = playerTurn;
    previ = lili;
    prevj = lilj;
    prevI = bigI;
    prevJ = bigJ;
    let localWinner = checkWinner(bigBoard[bigI][bigJ]);
    if(localWinner != null) {
        var largeTable = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board")[bigI*3+bigJ];
        largeTable.textContent = localWinner;
        largeTable.style.fontSize = "100px";
    }
 }

function validMove (bigI, bigJ, lili, lilj) {
    //game is over
    if (gameWinner != null) {
        return false;
    }
    //space is playable
    if (bigBoard[bigI][bigJ][lili][lilj] == "") {
        //first move is always good
        if (previ == -1 && prevj == -1) {
            return true;
        }
        //box is already won
        else if (checkWinner(bigBoard[bigI][bigJ]) != null) {
            return false;
        } 
        //last sent to completed box, any open space is playable
        else if (checkWinner(bigBoard[previ][prevj]) != null) {
            return true;
        } 
        //otherwise, must play in restricted box
        else if (bigI == previ && bigJ == prevj) {
            return true;
        }
    }
    return false;
}

async function nextTurn() {
    //check for game winner
    var result = checkBigBoard();
    //update turn label
    if (result != null) {
        //theres a winner!
        document.getElementById("player-turn-label").innerHTML = result + " wins!";
        document.getElementById("player-turn-label").style.display = "block";

        //update game history
        await saveGameHistory(result);
        return;
    }

    //toggle turn
    if (!VS_CPU) {
        if (playerTurn == "X") {
            playerTurn = "O";
        } else if (playerTurn == "O") {
            playerTurn = "X";
        }

        document.getElementById("player-turn-label").innerHTML = playerTurn + "'s turn";
        highlightBoard();
    } else {
        //get CPU move
        playerTurn = "O";
        document.getElementById("player-turn-label").innerHTML = "CPU's turn";
        highlightBoard();
        var move;
        //timeout isnt really needed
        //but it makes it look like the CPU is thinking
        setTimeout(function() {
            move = getCPUMove();
            updateBoard(move.I, move.J, move.i, move.j);
            document.getElementById("player-turn-label").innerHTML = "X's turn";
            playerTurn = "X";
            highlightBoard();
        }, 1000);
    }

    
}

function checkWinner(board) {
    let winner = null;

    // horizontal
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
        }
    }
    // Vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
        }
    }
    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
    }
    if (winner == null && is_full(board)) {
        winner = 'tie';
    } 
    return winner;
}

function equals3(a, b, c) {
    return a == b && b == c && a != '';
}

function is_full(board) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

function highlightBoard() {
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
    if (gameWinner != null) {
        return;
    }
    //highlight playable board
    const index = previ * 3 + prevj;
    largeTables[index].style.backgroundColor = highlightColor;
    //if user can go anywhere
    if (checkWinner(bigBoard[previ][prevj]) != null) {
        //highlight all boards
        largeTables.forEach(table => {
            table.style.backgroundColor = highlightColor;
        });
    }
}

function checkBigBoard() {
    var tempBoard = [
        ["","",""],
        ["","",""],
        ["","",""],
    ];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let result = checkWinner(bigBoard[i][j])
            if (result != null) {
                tempBoard[i][j] = result;
            }
        }
    }
    gameWinner = checkWinner(tempBoard);
    //if game is over, unhighlight board
    if (gameWinner != null) {  
        highlightBoard();
    }
    return gameWinner;
}

async function saveGameHistory(winner) {
    const game = {
        date: new Date().toDateString(),
        versus: VS_CPU ? 'Computer' : 'Local Multiplayer',
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

function updateGamesLocal(game) {
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    gameHistory.push(game);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

initialize();

export function isValidMove(move) {
    return validMove(move.I, move.J, move.i, move.j);
}