
var turn = 0;

// clones an object
var clone = object => {
    return JSON.parse(JSON.stringify(object));
}

var movingPiece = {};

var board = document.getElementById("board");

// hide available moves
board.hideAvailableMoves = () => {
    let signs = document.getElementsByClassName("circle");
    if(signs != null && signs.length != 0) {
        Array.from(signs).forEach((sign) => {
            let tile = sign.parentElement;
            tile.removeEventListener("click", tile.doMove);
            sign.remove();
        });
    }
}

// show available moves for the given piece
board.showAvailableMoves = (i,j) => {

    var piece = virtualBoard[i][j];
    console.log(piece.color, piece.type);
    board.hideAvailableMoves();
    switch(piece.type){
        case "pawn":
            let dir = 1;
            if(piece.color == "white"){
                dir = -1;
            }
            
            // checks if the row is null
            // checks if the tile is occupied by a piece
            if(virtualBoard[i+1*dir] != null && virtualBoard[i+1*dir][j].color == null){

                // forward 1
                board.tileAvailable(i+1*dir, j);

                // checks if the row is null
                if(virtualBoard[i+2*dir] != null){
                    // checks if this its first move
                    // checks if the tile is occupied by a piece
                    if(piece.firstMove == null && virtualBoard[i+2*dir][j].color == null){

                        // forward 2
                        board.tileAvailable(i+2*dir, j);
                    }
                }
            }

            // checks if the row is null
            if(virtualBoard[i+1*dir] != null){
                let diagonal = virtualBoard[i+1*dir][j+1];
                // checks if the tile is occupied by a piece of its own color
                if(diagonal != null && diagonal.color != null && diagonal.color != piece.color){
                    board.tileAvailable(i+1*dir, j+1);
                }
                
                diagonal = virtualBoard[i+1*dir][j-1];
                // checks if the tile is occupied by a piece of its own color
                if(diagonal != null && diagonal.color != null && diagonal.color != piece.color){
                    board.tileAvailable(i+1*dir, j-1);
                }
            }

            break;

        case "rook":
            // a cicle for every direction
            // 2 axis: vertical and horizontal
            for(let axis = 0; axis < 2; axis++){
                // 2 directions : away from the origin and towards
                for(let d = -1 ; d <= 1 ; d+=2){
                    // applies direction based on the axis
                    let n = i+1*d, m = j;
                    if(axis == 1){
                        n = i;
                        m = j+1*d;
                    }
                    // marks the spot until it reaches a piece or the end of the board
                    for(let end = false; !end; ) {
                        // checks if the tile exists
                        if(virtualBoard[n] != null && virtualBoard[n][m] != null){
                            // if the tile is empty marks the tile
                            if(virtualBoard[n][m].type == "empty"){
                                board.tileAvailable(n,m);
                            }
                            else{
                                // if the piece is the opposite colour marks the tile
                                if(virtualBoard[n][m].color != piece.color){
                                    board.tileAvailable(n,m);
                                }
                                // stops the search
                                end = true;
                            }
                        }
                        else{
                            end = true;
                        }

                        // updates the coordinate according to axis and direction
                        if(axis == 0){
                            n+= 1*d;
                        }
                        else if (axis == 1){
                            m+= 1*d;
                        }
                    }
                }
            }
            break;

        case "knight":
            break;

        case "bishop":
            break;
            
        case "king":
            break;

        case "queen":
            break;
    }

    movingPiece.i = i;
    movingPiece.j = j;
}


board.tileAvailable = (i,j) => {
    // adds a circle on the tile
    let circle = document.createElement("div");
    circle.className = "circle";
    
    let tile = board.childNodes[i+1].childNodes[j];

    // moves the piece and makes the tiles unavailable
    tile.doMove = () => {
        virtualBoard.move(i,j);
        board.hideAvailableMoves();
    }
    tile.addEventListener("click", tile.doMove);

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
                // checks if there's a piece in the clicked tile
                if(virtualBoard[i][j].type != "empty"){
                    let color = virtualBoard[i][j].color;
                    let movingColor = "black";
                    if(turn % 2 == 0){
                        movingColor = "white";
                    }

                    // checks if the color of the piece is right based on the turn
                    if(color == movingColor){
                        if(i != movingPiece.i || j != movingPiece.j){
                            board.showAvailableMoves(i,j);
                        }
                    }
                }
            }

            tile.addEventListener("click", tile.tryMove);

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
            virtualBoard[i][j].color = "black";
            virtualBoard[7-i][j].color = "white";
        }
    }
}


// renders the pieces on the board
virtualBoard.render = () => {
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            
            let image = document.createElement("img");
            let pieceType = virtualBoard[i][j].type;
            let pieceColor = virtualBoard[i][j].color;
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

// moves a piece 
virtualBoard.move = (i,j) => {
    virtualBoard[i][j] = virtualBoard[movingPiece.i][movingPiece.j];
    virtualBoard[movingPiece.i][movingPiece.j] = { type: "empty" };
    turn++;
    virtualBoard[i][j].firstMove = false;
    virtualBoard.render();
}


board.draw();
virtualBoard.setupVirtualBoard();
virtualBoard.render();