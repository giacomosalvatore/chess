var board = document.getElementById("board");

// draws the board on the screen
board.draw = () => {
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
}

// sets up the board with the pieces
board.setup = () => {

    let image = document.createElement("img");

    // pawns
    for(let i = 0; i < 8; i++){
        // white
        image = document.createElement("img");
        image.src = "pieces/white/pawn.png";
        board.childNodes[2].childNodes[i].appendChild(image);

        // black
        image = document.createElement("img");
        image.src = "pieces/black/pawn.png";
        board.childNodes[7].childNodes[i].appendChild(image);
    }

    // white rooks
    image = document.createElement("img");
    image.src = "pieces/white/rook.png";
    board.childNodes[1].childNodes[0].appendChild(image);
    
    image = document.createElement("img");
    image.src = "pieces/white/rook.png";
    board.childNodes[1].childNodes[7].appendChild(image);

    // white knights
    image = document.createElement("img");
    image.src = "pieces/white/knight.png";
    board.childNodes[1].childNodes[1].appendChild(image);
    
    image = document.createElement("img");
    image.src = "pieces/white/knight.png";
    board.childNodes[1].childNodes[6].appendChild(image);

    // white bishops
    image = document.createElement("img");
    image.src = "pieces/white/bishop.png";
    board.childNodes[1].childNodes[2].appendChild(image);
    
    image = document.createElement("img");
    image.src = "pieces/white/bishop.png";
    board.childNodes[1].childNodes[5].appendChild(image);

    // white king
    image = document.createElement("img");
    image.src = "pieces/white/king.png";
    board.childNodes[1].childNodes[3].appendChild(image);
    
    // white queen
    image = document.createElement("img");
    image.src = "pieces/white/queen.png";
    board.childNodes[1].childNodes[4].appendChild(image);

    // black rooks
    image = document.createElement("img");
    image.src = "pieces/black/rook.png";
    board.childNodes[8].childNodes[0].appendChild(image);
    
    image = document.createElement("img");
    image.src = "pieces/black/rook.png";
    board.childNodes[8].childNodes[7].appendChild(image);

    // black knights
    image = document.createElement("img");
    image.src = "pieces/black/knight.png";
    board.childNodes[8].childNodes[1].appendChild(image);
    
    image = document.createElement("img");
    image.src = "pieces/black/knight.png";
    board.childNodes[8].childNodes[6].appendChild(image);

    // black bishops
    image = document.createElement("img");
    image.src = "pieces/black/bishop.png";
    board.childNodes[8].childNodes[2].appendChild(image);
    
    image = document.createElement("img");
    image.src = "pieces/black/bishop.png";
    board.childNodes[8].childNodes[5].appendChild(image);

    // black king
    image = document.createElement("img");
    image.src = "pieces/black/king.png";
    board.childNodes[8].childNodes[3].appendChild(image);
    
    // black queen
    image = document.createElement("img");
    image.src = "pieces/black/queen.png";
    board.childNodes[8].childNodes[4].appendChild(image);
}


board.draw();
board.setup();