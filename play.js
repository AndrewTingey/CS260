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
        console.log("I: " + clickedI + "\nJ: " + clickedJ + "\ni: " + clickedi + "\nj: " + clickedj);
        if (cellClicked(clickedI, clickedJ, clickedi, clickedj)) {
            this.textContent = playerTurn;
            //updateBoard(clickedI, clickedJ, clickedi, clickedj);
            nextTurn();
        }
        return;
    }
}

//returns true if valid move, false if invalid
function cellClicked (bigI, bigJ, lili, lilj) {
    if (bigBoard[bigI][bigJ][lili][lilj] == "") {
        bigBoard[bigI][bigJ][lili][lilj] = playerTurn;
        //document.getElementById("big" + bigI + bigJ).rows[lili].cells[lilj].innerHTML = playerTurn;
        prevI = bigI;
        prevJ = bigJ;
        previ = lili;
        prevj = lilj;
        return true;
    } else {
        alert("This cell has already been played");
        console.log("This is cell I: " + bigI + " J: " + bigJ + " i: " + lili + " j: " + lilj + " and it has already been played");
        return false;
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
