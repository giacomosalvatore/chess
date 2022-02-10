class VirtualBoard{
    constructor(){
        this.virtualBoard = [];
        this.setupVirtualBoard();
        this.movingPiece = {};
        this.turn = 0;
        this.kingCoords = {
            "white": {i: 7, j: 4},
            "black": {i: 0, j: 4},
        };
        this.pawnPromotion = { value: false, };
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

    // set the moving piece if it can move, returns result
    moving(i,j){
        // checks if there's a piece in the clicked tile
        if(this.virtualBoard[i][j].type != "empty" && !this.pawnPromotion.value){
               
            let color = this.virtualBoard[i][j].color;
            let movingColor = "black";
            if(this.turn % 2 == 0){
                movingColor = "white";
            }

            // checks if the color of the piece is right based on the turn
            if(color == movingColor){
                // if(i != this.movingPiece.i || j != this.movingPiece.j){
                    this.movingPiece.i = i;
                    this.movingPiece.j = j;
                    return true;
                // }
            }
        }
        return false;
    }

    // moves a piece 
    move(i,j) {

        // castling
        if(this.virtualBoard[i][j].color == this.virtualBoard[this.movingPiece.i][this.movingPiece.j].color){
            let dir = this.castleDir;

            // tracks the king's position
            this.kingCoords[this.virtualBoard[i][j].color].i = this.movingPiece.i;
            this.kingCoords[this.virtualBoard[i][j].color].j = this.movingPiece.j + 2*dir;

            this.virtualBoard[this.movingPiece.i][this.movingPiece.j + 2*dir] = this.virtualBoard[this.movingPiece.i][this.movingPiece.j];
            this.virtualBoard[this.movingPiece.i][this.movingPiece.j + 1*dir] = this.virtualBoard[i][j];
            this.virtualBoard[this.movingPiece.i][this.movingPiece.j] = { type: "empty" };
            this.virtualBoard[i][j] = { type: "empty" };
        }
        else{
            this.virtualBoard[i][j] = this.virtualBoard[this.movingPiece.i][this.movingPiece.j];
            this.virtualBoard[this.movingPiece.i][this.movingPiece.j] = { type: "empty" };

            // if the mover is a pawn that reached the end of the board
            // since pawns can't move backwards and stard from the second row
            // they can't land on thir side's first row
            if(this.virtualBoard[i][j].type == "pawn" && (i == 0 || i == 7)){
                // stops the game until pawnPromote is called
                this.pawnPromotion.value = true;
                this.pawnPromotion.color = this.virtualBoard[i][j].color;
                this.pawnPromotion.i = i;
                this.pawnPromotion.j = j;
            }

            // tracks the king's position
            if(this.virtualBoard[i][j].type == "king"){
                this.kingCoords[this.virtualBoard[i][j].color].i = i;
                this.kingCoords[this.virtualBoard[i][j].color].j = j;
            }
        }

        this.turn++;
        this.virtualBoard[i][j].firstMove = false;


        this.virtualBoard[i][j].lastMoveTurn = this.turn;

        // if a enPassant has been set in this turn (turn has already been increased)
        if(this.enPassant != null && this.enPassant.turn == this.turn -1){
            // if the moving piece is the same that set the en passant
            if(this.enPassant.i == this.movingPiece.i && this.enPassant.j == this.movingPiece.j){
                // captures the piece
                this.virtualBoard[this.enPassant.n][this.enPassant.m] = { type: "empty" };
            }
        }
        
        // if the moves is in the real virtual board
        // !!! this code should be moved to script.js
        if(this == virtual && this.isCheckMate()){
            let winner = "white", loser = "black";
            if(this.turn%2 == 0){
                winner = "black";
                loser = "white";
            }
            let string = "CheckMate!\n"+winner+" wins!";
            if(!this.isOnCheck(loser)){
                string = "StealMate"
            }
            setTimeout(() => {alert(string);}, 10);
        }
    }

    // returns the board
    board() {
        return this.virtualBoard;
    }

    // returns the available moves for a given piece
    getAvailableMoves = (i = this.movingPiece.i ,j = this.movingPiece.j, simple = false) => {

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
                
                // forward movement
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

                // diagonal captures
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

                // en passant
                // n for direction leftright
                for(let n = -1; n <= 1; n+=2){
                    let sideSpot = this.virtualBoard[i][j+1*n];
                    // if on the side there's a pawn that just moved
                    if(sideSpot != null && sideSpot.type == "pawn" && sideSpot.lastMoveTurn == this.turn){
                        // if the pawn is 2 rows away from his original position
                        if(i == (7+dir)/2){
                            // sets the en passant object
                            this.enPassant = {};
                            this.enPassant.turn = clone(this.turn);
                            this.enPassant.i = i;
                            this.enPassant.j = j;
                            this.enPassant.n = i;
                            this.enPassant.m = j+1*n;

                            // sets the next tile as available
                            availableMoves[i+1*dir][j+1*n] = true;
                        }
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
                for(let x = i-1; x <= i+1; x++){
                    for(let y = j-1; y <= j+1; y++){
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

                // castling rules: 
                // can't if rook or king already moved +
                // can't if there's pieces in between +
                // cant if oncheck +
                // cant if landoncheck +
                // cant if pass through check
                let kingJ = 4;
                let kingI = 0;
                if(this.turn%2 == 0){
                    kingI = 7;
                }
                // don't need it in "simple" because it's not an offensive move and can't capture
                if(kingI == i && kingJ == j && !simple){
                    for(let col = 0, direction = -1; col <= 7; col += 7, direction +=2){
                        // checks both sides in the spot where the rooks should be
                        let rook = this.virtualBoard[kingI][col];
                        if(rook.type == "rook" && rook.color == piece.color){
                            // they shouldnt have moved yet
                            if(rook.firstMove == null && piece.firstMove == null){
                                // the spots in between should be empty
                                let empty = true;
                                let spaces = 3;
                                if(direction == 1){
                                    spaces = 2;
                                }
                                for(let s = j+1*direction; s*direction <= (j+spaces*direction)*direction && empty; s+=1*direction){
                                    if(this.virtualBoard[kingI][s].type != "empty"){
                                        empty = false;
                                    }
                                }
                                if(empty){
                                    // cant do it if on check
                                    if(!this.isOnCheck(piece.color)){
                                        // cant do it if land on check
                                        if(!this.wouldBeOnCheck(i,j, i, j+2*direction)){
                                            // cant if pass through check
                                            if(!this.wouldBeOnCheck(i,j, i, j+1*direction)){
                                                availableMoves[kingI][col] = true;
                                                this.castleDir = direction;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                break;

        }

        // deletes the moves that would mean check
        if(!simple){
            for(let n = 0; n < 8; n++) {
                for(let m = 0; m < 8; m++){
                    if(availableMoves[n][m] && this.wouldBeOnCheck(i, j, n, m)){
                        availableMoves[n][m] = false;
                    }
                }
            }
        }
        
        return availableMoves;
    }

    // verifies if the board has a check by piece color
    isOnCheck(pColor){
        let check = false;
        let kingX = this.kingCoords[pColor].i;
        let kingY = this.kingCoords[pColor].j;
        // for every opponent's piece, 
        // gets the available moves to see if its king's coordinates are available
        for(let i = 0; i<8 && !check; i++){
            for(let j = 0; j<8 && !check; j++){
                let piece = this.virtualBoard[i][j];
                if(piece.color != pColor && piece.type != "empty"){
                    let available = this.getAvailableMoves(i,j, true);
                    if(available[kingX][kingY]){
                        check = true;
                    }
                }
            }
        }
        return check;
    }

    // verifies if the mover, with the specified move, would be on check
    wouldBeOnCheck(i,j, n,m){
        // clones the board to try moves beforehand
        let cloneBoard = this.clone();
        let color = cloneBoard.virtualBoard[i][j].color
        cloneBoard.getAvailableMoves(i,j, true);
        if(cloneBoard.moving(i,j)){
            cloneBoard.move(n,m);
        }
        return cloneBoard.isOnCheck(color);
    }

    // verifies if the mover is on checkmate
    isCheckMate(){
        let checkMate = true;
        let pColor = "white";
        if(this.turn%2 == 1){
            pColor = "black";
        }
        // checks every piece of the board
        for(let i = 0; i < 8 && checkMate; i++){
            for(let j = 0; j < 8 && checkMate; j++){
                // if the piece matches the player color checks if it can move
                if(this.virtualBoard[i][j].color == pColor){
                    let available = this.getAvailableMoves(i,j);
                    for(let k = 0; k < 8 && checkMate; k++){
                        for(let m = 0; m < 8 && checkMate; m++){
                            if(available[k][m]){
                                checkMate = false;
                            }
                        }
                    }
                }
            }
        }

        return checkMate;
    }

    // promotes the set pawn to a specified piece
    pawnPromote(pieceType){
        if(!this.pawnPromotion.value){
            return;
        }
        this.virtualBoard[this.pawnPromotion.i][this.pawnPromotion.j].type = pieceType;
        // unpauses the game
        this.pawnPromotion.value = false;
    }
    
    // clones the instance in a new instance
    clone(){
        let vb = new VirtualBoard();
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                vb.virtualBoard[i][j] = clone(this.virtualBoard[i][j]);
            }
        }
        
        vb.movingPiece = clone(this.movingPiece);
        vb.turn = clone(this.turn);
        vb.kingCoords = clone(this.kingCoords);

        return vb;
    }
}
