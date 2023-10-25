var playerTurn = "X";
var prevI = 0;
var prevJ = 0;
var previ = 0;
var prevj = 0;

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

var small_tables = document.querySelectorAll(".inner-table");
for (var i = 0; i < small_tables.length; i++) {
    var small_cells = small_tables[i].getElementsByTagName("td");
    for (var j = 0; j < small_cells.length; j++) {
        small_cells[j].addEventListener("click", smallCellEventListener());
    }
}

var large_tables = document.querySelectorAll(".outer-table");
for (var i = 0; i < large_tables.length; i++) {
    var large_cells = large_tables[i].getElementsByClassName("big-board");
    for (var j = 0; j < large_cells.length; j++) {
        large_cells[j].addEventListener("click", largeCellEventListener());
    }
}

function smallCellEventListener() {
    return function() {
        if (this.textContent === "") {
            this.textContent = playerTurn;
        }
        console.log("i: " + this.parentNode.rowIndex + "\nj: " + this.cellIndex);
        nextTurn();
        return;
    }
}

function largeCellEventListener() {
    return function() {
        console.log("I: " + this.parentNode.rowIndex + "\nJ: " + this.cellIndex);
        return;
    }
}

function nextTurn() {
    if (playerTurn == "X") {
        playerTurn = "O";
    } else if (playerTurn == "O") {
        playerTurn = "X";
    }
    document.getElementById("player-turn-label").innerHTML = playerTurn + "'s turn";
}
