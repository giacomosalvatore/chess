var board = document.getElementById("board");

// clones an object
var clone = object => {
    return JSON.parse(JSON.stringify(object));
}

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

// set up the virtual board with the pieces
var virtualBoard =  [];
virtualBoard.setupVirtualBoard = () => {

    // back line of pieces
    let piecesLine = [
        {type:"rook"},
        {type:"knight"},
        {type:"bishop"},
        {type:"king"},
        {type:"queen"},
        {type:"bishop"},
        {type:"knight"},
        {type:"rook"},
    ];
    virtualBoard.push(piecesLine);

    // line of pawn
    let pawnLine = [];
    for(let i = 0; i < 8; i++){
        pawnLine.push({type:"pawn",});
    }
    virtualBoard.push(pawnLine);

    // empty spots
    for(let i = 0; i < 4; i++){
        let emptyLine = [];
        for(let j = 0; j < 8; j++){
            emptyLine.push({type:"empty",});
        }
        virtualBoard.push(emptyLine);
    }

    virtualBoard.push(clone(pawnLine));
    virtualBoard.push(clone(piecesLine));

    // colors the pieces 
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 8; j++){
            virtualBoard[i][j].color = "white";
            virtualBoard[7-i][j].color = "black";
        }
    }
}

virtualBoard.render = () => {
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            
            let image = document.createElement("img");
            let pieceType = virtualBoard[i][j].type;
            let pieceColor = virtualBoard[i][j].color;
            if(pieceType != "empty"){
                image.src = 'pieces/' + pieceColor + '/' + pieceType + '.png';
            }
            board.childNodes[i+1].childNodes[j].appendChild(image);
        }
    }
}


board.draw();
virtualBoard.setupVirtualBoard();
virtualBoard.render();