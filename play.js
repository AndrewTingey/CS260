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
 }

//returns true if valid move, false if invalid
function validMove (bigI, bigJ, lili, lilj) {
    if (bigBoard[bigI][bigJ][lili][lilj] == "") {
        if (checkWinner(bigBoard[previ][prevj]) != null) {
            return true;
        } else if (bigI == previ && bigJ == prevj) {
            return true;
        }
    }
    //console.log("This is cell I: " + bigI + " J: " + bigJ + " i: " + lili + " j: " + lilj + " and it has already been played");
    return false;
}

function nextTurn() {
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
        for (let j = 0; j < 3; i++) {
            if (board[i][j] == '') {
                return false;
            }
        }
    }
    return true;
}

function highlightBoard() {
    var largeTables = document.querySelectorAll(".outer-table")[0].getElementsByClassName("big-board");
    for (var i = 0; i < largeTables.length; i++) {
        largeTables[i].style.backgroundColor = "var(--background-color)";
    }
    
    console.log ("previ: " + previ + " prevj: " + prevj);

    if (previ == 0 && prevj == 0) { //top left
        largeTables[0].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 0 && prevj == 1) { //top middle
        largeTables[1].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 0 && prevj == 2) { //top right
        largeTables[2].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 1 && prevj == 0) { //middle left
        largeTables[3].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 1 && prevj == 1) { //middle middle
        largeTables[4].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 1 && prevj == 2) { //middle right
        largeTables[5].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 2 && prevj == 0) { //bottom left
        largeTables[6].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 2 && prevj == 1) { //bottom middle
        largeTables[7].style.backgroundColor = "var(--highlight-color)";
    } else if (previ == 2 && prevj == 2) { //bottom right
        largeTables[8].style.backgroundColor = "var(--highlight-color)";
    }
}