var board = document.getElementById("board");

// var virtualBoard = [8][8];

for(let i = 0; i < 8; i++){

    var boardRow = document.createElement("div");
    boardRow.className = "board-row";

    for(let j = 0; j < 8; j++){
        let tile = document.createElement("div");
        tile.className = "tile";
        if((i + j)%2 == 0){
            tile.style.backgroundColor = "rgb(145, 85, 25)";
        }
        else{
            tile.style.backgroundColor = "rgb(206, 133, 60)";
        }
        boardRow.appendChild(tile);
    }

    board.appendChild(boardRow);
}