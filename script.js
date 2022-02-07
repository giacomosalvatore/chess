
var turn = 0;

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
            sign.remove();
        });
    }
}

// show available moves for the given piece
board.showAvailableMoves = (i,j) => {

    board.hideAvailableMoves();
    
    let availableMoves = virtual.getAvailableMoves(i,j);
    for(let n = 0; n < availableMoves.length; n++){
        let row = availableMoves[n];
        for(let m = 0; m < row.length; m++){
            if(row[m]){
                board.tileAvailable(n,m);
            }
        }
    }

    virtual.movingPiece.i = i;
    virtual.movingPiece.j = j;
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
                if(virtual.board()[i][j].type != "empty"){
                    let color = virtual.board()[i][j].color;
                    let movingColor = "black";
                    if(turn % 2 == 0){
                        movingColor = "white";
                    }

                    // checks if the color of the piece is right based on the turn
                    if(color == movingColor){
                        if(i != virtual.movingPiece.i || j != virtual.movingPiece.j){
                            board.showAvailableMoves(i,j);
                        }
                    }
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


class VirtualBoard{
    constructor(){
        this.virtualBoard = [];
        this.setupVirtualBoard();
        this.movingPiece = {};
    }
    
    // set up the virtual board with the pieces
    setupVirtualBoard = () => {

        // back line of pieces
        let piecesLine = [
            {type:"rook"},
            {type:"knight"},
            {type:"bishop"},
            {type:"queen"},
            {type:"king"},
            {type:"bishop"},
            {type:"knight"},
            {type:"rook"},
        ];
        this.virtualBoard.push(piecesLine);
    
        // line of pawn
        let pawnLine = [];
        for(let i = 0; i < 8; i++){
            pawnLine.push({type:"pawn",});
        }
        this.virtualBoard.push(pawnLine);
    
        // empty spots
        for(let i = 0; i < 4; i++){
            let emptyLine = [];
            for(let j = 0; j < 8; j++){
                emptyLine.push({type:"empty",});
            }
            this.virtualBoard.push(emptyLine);
        }
    
        this.virtualBoard.push(clone(pawnLine));
        this.virtualBoard.push(clone(piecesLine));
    
        // colors the pieces 
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < 8; j++){
                this.virtualBoard[i][j].color = "black";
                this.virtualBoard[7-i][j].color = "white";
            }
        }
    }

    // moves a piece 
    move(i,j) {
        this.virtualBoard[i][j] = this.virtualBoard[this.movingPiece.i][this.movingPiece.j];
        this.virtualBoard[this.movingPiece.i][this.movingPiece.j] = { type: "empty" };
        turn++;
        this.virtualBoard[i][j].firstMove = false;
        board.render();
    }

    // returns the board
    board() {
        return this.virtualBoard;
    }

    // returns the available moves for a given piece
    getAvailableMoves = (i,j) => {

        var piece = this.virtualBoard[i][j];

        var availableMoves = [];
        for(let n = 0; n < 8; n++) {
            var row = [];
            for(let m = 0; m < 8; m++){
                row.push(false);
            }
            availableMoves.push(row);
        }

        switch(piece.type){
            case "pawn":
                let dir = 1;
                if(piece.color == "white"){
                    dir = -1;
                }
                
                // checks if the row is null
                // checks if the tile is occupied by a piece
                if(this.virtualBoard[i+1*dir] != null && this.virtualBoard[i+1*dir][j].color == null){

                    // forward 1
                    availableMoves[i+1*dir][j] = true;

                    // checks if the row is null
                    if(this.virtualBoard[i+2*dir] != null){
                        // checks if this its first move
                        // checks if the tile is occupied by a piece
                        if(piece.firstMove == null && this.virtualBoard[i+2*dir][j].color == null){

                            // forward 2
                            availableMoves[i+2*dir][j] = true;
                        }
                    }
                }

                // checks if the row is null
                if(this.virtualBoard[i+1*dir] != null){
                    let diagonal = this.virtualBoard[i+1*dir][j+1];
                    // checks if the tile is occupied by a piece of its own color
                    if(diagonal != null && diagonal.color != null && diagonal.color != piece.color){
                        availableMoves[i+1*dir][j+1] = true;
                    }
                    
                    diagonal = this.virtualBoard[i+1*dir][j-1];
                    // checks if the tile is occupied by a piece of its own color
                    if(diagonal != null && diagonal.color != null && diagonal.color != piece.color){
                        availableMoves[i+1*dir][j-1] = true;
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
                            if(this.virtualBoard[n] != null && this.virtualBoard[n][m] != null){
                                // if the tile is empty marks the tile
                                if(this.virtualBoard[n][m].type == "empty"){
                                    availableMoves[n][m] = true;
                                }
                                else{
                                    // if the piece is the opposite colour marks the tile
                                    if(this.virtualBoard[n][m].color != piece.color){
                                        availableMoves[n][m] = true;
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
                // vertical or horizontal movement
                for(let axis = 0; axis < 2; axis++){
                    // two steps: towards origin or away
                    for(let d2 = -1; d2 <= 1; d2+=2){
                        // one step: towards origin or away
                        for(let d1 = -1; d1 <= 1; d1+=2){
                            let x = i + 2*d2;
                            let y = j + 1*d1;
                            if(axis == 1){
                                x = i + 1*d1;
                                y = j + + 2*d2;
                            }

                            // checks if the tile exists
                            if(this.virtualBoard[x] != null && this.virtualBoard[x][y] != null){
                                // if the tile is empty marks the tile
                                if(this.virtualBoard[x][y].type == "empty"){
                                    availableMoves[x][y] = true;
                                }
                                else{
                                    // if the piece is the opposite colour marks the tile
                                    if(this.virtualBoard[x][y].color != piece.color){
                                        availableMoves[x][y] = true;
                                    }
                                }
                            }
                        }
                    }
                }
                break;

            case "bishop":
                for(let dx = -1; dx <= 1; dx += 2){
                    for(let dy = -1; dy <= 1; dy += 2){
                        for(let c = 1, end = false; !end; c++) {
                            let x = i+c*dx;
                            let y = j+c*dy;
                            // checks if the tile exists
                            if(this.virtualBoard[x] != null && this.virtualBoard[x][y] != null){
                                // if the tile is empty marks the tile
                                if(this.virtualBoard[x][y].type == "empty"){
                                    availableMoves[x][y] = true;
                                }
                                else{
                                    // if the piece is the opposite colour marks the tile
                                    if(this.virtualBoard[x][y].color != piece.color){
                                        availableMoves[x][y] = true;
                                    }
                                    // stops the search
                                    end = true;
                                }
                            }
                            else{
                                end = true;
                            }
                        }
                    }
                }
                break;
            
            case "queen":
                for(let dx = -1; dx <= 1; dx++){
                    for(let dy = -1; dy <= 1; dy++){
                        for(let c = 1, end = false; !end; c++) {
                            let x = i+c*dx;
                            let y = j+c*dy;
                            // checks if the tile exists
                            if(this.virtualBoard[x] != null && this.virtualBoard[x][y] != null){
                                // if the tile is empty marks the tile
                                if(this.virtualBoard[x][y].type == "empty"){
                                    availableMoves[x][y] = true;
                                }
                                else{
                                    // if the piece is the opposite colour marks the tile
                                    if(this.virtualBoard[x][y].color != piece.color){
                                        availableMoves[x][y] = true;
                                    }
                                    // stops the search
                                    end = true;
                                }
                            }
                            else{
                                end = true;
                            }
                        }
                    }
                }
                break; 

            case "king":
                break;

        }

        return availableMoves;
    }
}

board.draw();
var virtual = new VirtualBoard();
board.render();