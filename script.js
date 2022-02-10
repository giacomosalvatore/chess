
// clones an object
var clone = object => {
    return JSON.parse(JSON.stringify(object));
}

var board = document.getElementById("board");

// hide available moves
board.hideAvailableMoves = () => {
    let signs = document.getElementsByClassName("circle");
    if(signs != null && signs.length != 0) {
        Array.from(signs).forEach((sign) => {
            let tile = sign.parentElement;
            tile.removeEventListener("click", tile.doMove);
            tile.addEventListener("click", tile.tryMove);
            sign.remove();
        });
    }
}

// show available moves for the given piece
board.showAvailableMoves = () => {

    board.hideAvailableMoves();
    
    let availableMoves = virtual.getAvailableMoves();
    for(let n = 0; n < availableMoves.length; n++){
        let row = availableMoves[n];
        for(let m = 0; m < row.length; m++){
            if(row[m]){
                board.tileAvailable(n,m);
            }
        }
    }

}


board.tileAvailable = (i,j) => {
    // adds a circle on the tile
    let circle = document.createElement("div");
    circle.className = "circle";
    
    let tile = board.childNodes[i+1].childNodes[j];

    // moves the piece and makes the tiles unavailable
    tile.doMove = () => {
        virtual.move(i,j);
        board.hideAvailableMoves();
        board.render();
    }
    tile.addEventListener("click", tile.doMove);
    tile.removeEventListener("click", tile.tryMove);

    tile.appendChild(circle);
}

// draws the board on the screen
board.draw = () => {
    for(let i = 0; i < 8; i++){

        var boardRow = document.createElement("div");
        boardRow.className = "board-row";
    
        for(let j = 0; j < 8; j++){
            let tile = document.createElement("div");
            tile.className = "tile";
            
            tile.tryMove = () => {
                if(virtual.moving(i,j)){
                    board.showAvailableMoves();
                }
            }

            tile.addEventListener("click", tile.tryMove);

            if((i + j)%2 == 0){
                tile.style.backgroundColor = "rgb(206, 133, 60)";
            }
            else{
                tile.style.backgroundColor = "rgb(145, 85, 25)";
            }
            boardRow.appendChild(tile);
        }
    
        board.appendChild(boardRow);
    }
}

// renders the pieces on the board
board.render = () => {
    let vBoard = virtual.board();
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            
            let image = document.createElement("img");
            let pieceType = vBoard[i][j].type;
            let pieceColor = vBoard[i][j].color;
            if(pieceType != "empty"){
                image.src = 'pieces/' + pieceColor + '/' + pieceType + '.png';
            }
            var tile = board.childNodes[i+1].childNodes[j]
            tile.innerHTML = "";
            tile.removeEventListener("click", tile.doMove);
            tile.appendChild(image);
        }
    }
}

board.draw();
var virtual = new VirtualBoard();
board.render();