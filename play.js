let player1 = "X";
let player2 = "O";


function cellEventListener() {
    return function() {
        if (this.textContent == player1) {
            this.textContent = player2;
            return;
        }
        else if (this.textContent == player2) {
            this.textContent = player1;
            return;
        } else {
            this.textContent = player1;
        }
    }
}

var tables = document.querySelectorAll(".inner-table");
for (var i = 0; i < tables.length; i++) {
    var cells = tables[i].getElementsByTagName("td");
    for (var j = 0; j < cells.length; j++) {
        cells[j].addEventListener("click", cellEventListener());
    }
}