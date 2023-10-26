var playerTurn = "X";
var prevI = 0;
var prevJ = 0;
var previ = 0;
var prevj = 0;
var clickedI = 0;
var clickedJ = 0;
var clickedi = 0;   
var clickedj = 0;

//initialize full board
let bigBoard = [];
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
        small_cells[j].addEventListener("click", smallCellEventListener());
    }
}

function smallCellEventListener() {
    return function() {
        clickedI = this.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex;
        clickedJ = this.parentNode.parentNode.parentNode.parentNode.cellIndex;
        clickedi = this.parentNode.rowIndex;
        clickedj = this.cellIndex;
        //console.log("I: " + clickedI + "\nJ: " + clickedJ + "\ni: " + clickedi + "\nj: " + clickedj);
        if (validMove(clickedI, clickedJ, clickedi, clickedj)) {
            this.textContent = playerTurn;
            updateBoard(clickedI, clickedJ, clickedi, clickedj);
            nextTurn();
        }
        return;
    }
}

function updateBoard(bigI, bigJ, lili, lilj) {
    bigBoard[bigI][bigJ][lili][lilj] = playerTurn;
    previ = lili;
    prevj = lilj;
    prevI = bigI;
    prevJ = bigJ;
    if(checkWinner(bigBoard[bigI][bigJ])) {
        //TODO: THESE THREE LINES ARE BROKEN WHEN WINNER IS NOT IN BOX 0,0

        var largeTable = document.querySelectorAll(".outer-table")[0].getElementsByTagName("td")[bigI*3+bigJ];
        largeTable.textContent = "X";
        largeTable.style.fontSize = "100px";

        //var largeTable = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board")[bigI*3+bigJ];
        //.style.backgroundColor = "var(--highlight-color)";
        //console.log("This is the winner: " + checkWinner(bigBoard[bigI][bigJ]));
    }
 }

//returns true if valid move, false if invalid
function validMove (bigI, bigJ, lili, lilj) {
    console.log("I: " + bigI + "\nJ: " + bigJ + "\ni: " + lili + "\nj: " + lilj);
    //space is playable
    if (bigBoard[bigI][bigJ][lili][lilj] == "") {
        //box is already full
        if (checkWinner(bigBoard[bigI][bigJ]) != null) {
            return false;
        } 
        //any open space is playable
        else if (checkWinner(bigBoard[previ][prevj]) != null) {
            return true;
        }
        //must play in restricted box
        else if (bigI == previ && bigJ == prevj) {
            return true;
        }
    }
    return false;
}

function nextTurn() {
    var result = checkBigBoard();
    if (result != null) {
        document.getElementById("player-turn-label").innerHTML = result + " wins!";
        document.getElementById("player-turn-label").style.display = "block";
        return;
    }

    if (playerTurn == "X") {
        playerTurn = "O";
    } else if (playerTurn == "O") {
        playerTurn = "X";
    }
    highlightBoard();
    document.getElementById("player-turn-label").innerHTML = playerTurn + "'s turn";
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

    if (checkWinner(bigBoard[previ][prevj]) != null) {
        largeTables.forEach(table => {
            table.style.backgroundColor = highlightColor;
        });
        return;
    }

    largeTables.forEach(table => {
        table.style.backgroundColor = backgroundColor;
        table.style.borderRadius = borderRadius;
    });

    const index = previ * 3 + prevj;
    largeTables[index].style.backgroundColor = highlightColor;
}

function checkBigBoard() {
    var tempBoard = [
        ["","",""],
        ["","",""],
        ["","",""],
    ]
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            result = checkWinner(bigBoard[i][j])
            if (result != null) {
                tempBoard[i][j] = result
            }
        }
    }
    return checkWinner(tempBoard);
}