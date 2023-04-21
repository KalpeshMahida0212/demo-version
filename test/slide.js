const MOVES = { 
    RIGHT: 1, // 1
    LEFT: 2,  // -1
    UP: 3,    // -1
    DOWN: 4,  // 1
};

// -- GAME SETTINGS --
const shuffleCount = 152;
const maxRow = 3;
const maxColumn = 3;
const startPieceID = 0;


// Params: 
const container = document.getElementById('container');
const containerWidth = container.clientWidth;
const containerHeight = container.clientWidth;
const pieceWidth = Math.round(containerWidth/maxColumn);
const pieceHeight = Math.round(containerHeight/maxRow);
let pieceKeeper = [];
let emptyPiece = null;
// indicies that track the original position of the black piece;
let posX = null;
let postY = null;
let gameStrings = [ "Press Start to begin the puzzle! 😎",
                    "Click pieces adjacent to the empty piece to move. Good luck! 🤡 Click and hold hint button for clues.",
                    "🎊🎉🎉 CONGRATULATIONS! YOU WON! 🎉🎉🎊"
                  ];
let _isMoving = false;

//Add listeners
let startBtn = document.getElementById('start-btn');
let hintBtn = document.getElementById('hint-btn');

startBtn.addEventListener('click', start);
hintBtn.addEventListener('mousedown', showHint);
hintBtn.addEventListener('mouseup',hideHint);

init();


// Button functions:
function start() {
  setGameMessage(1);
  hideHint();
  startBtn.innerHTML = 'Restart';

  for(let i=0; i<maxRow; i++) {
    for(let j=0; j<maxColumn; j++) {
      let piece = pieceKeeper[i][j];
      if(piece.getAttribute('idNum') !== startPieceID.toString()) {
        piece.addEventListener('click', move);
      }
    }
  }

  blink(emptyPiece);
}

function showHint() {
  let hint = document.getElementById('hint');
  hint.style.display = "block";
}

function hideHint() {
  let hint = document.getElementById('hint');
  hint.style.display = "none";
}

// Game functions:

function init() {

  let hint = document.getElementById('hint');
  hint.style.width = `${maxRow*pieceWidth}px`;
  hint.style.height = `${maxRow*pieceHeight}px`;

  let count = 0;
  for(let i=0; i<maxRow; i++) {
    let row = [];
    for(let j=0; j<maxColumn; j++) {
      let piece = document.createElement('div');
      container.appendChild(piece);
      piece.setAttribute("idNum", count); 
      piece.style.height = pieceHeight + "px";
      piece.style.width = pieceWidth + "px";
      piece.style.left = i*pieceWidth + "px";
      piece.style.top = j*pieceHeight + "px";
      piece.className = 'piece';
      piece.style.backgroundPositionX = `-${i*pieceWidth}px`;
      piece.style.backgroundPositionY = `-${j*pieceHeight}px`

      if(count === startPieceID) {
        //The bottom right piece shall be the black piece
        // piece.className = 'empty-piece';
        // piece.className = 'piece';
        emptyPiece = piece;
        posX = i;
        posY = j;
        piece.style.zIndex = 1;
      }
      else {  
        piece.style.zIndex = 2;
      }

      row.push(piece);
      count++   
    }
    //Keep pieces in a multi-dimensional array
    pieceKeeper.push(row);
  }
}

function setGameMessage(num) {
  let message = document.getElementById('message');
  message.innerHTML = gameStrings[num];
}


function shuffle() {
  let currentX = posX;
  let currentY = posY;
  let finalMoves = [];
  let previousMove; // we don't want any reverse moves!

  for(let i=0; i<shuffleCount; i++){
    let choiceMoves = _checkAvailableMoves(currentX,currentY, previousMove);
    let move = _chooseRandomMove(choiceMoves);
    let newPos = _shuffleMove(move,currentX, currentY);
    previousMove = move;
    currentX = newPos.x;
    currentY = newPos.y;
  }
}


// function for moving a piece when clicked. The move is always
// with respect to the empty piece.
function move(e) {
  let currentPiecePosX = this.offsetLeft/pieceWidth;
  let currentPiecePosY = this.offsetTop/pieceHeight;
  let emptyPieceCurrentPosX = emptyPiece.offsetLeft/pieceWidth;
  let emptyPieceCurrentPosY = emptyPiece.offsetTop/pieceHeight;

  // Check if piece is adjent. If not, then return
  if(currentPiecePosX !== emptyPieceCurrentPosX && currentPiecePosY !== emptyPieceCurrentPosY)
    return;

  if(Math.abs(emptyPieceCurrentPosX - currentPiecePosX) > 1 || 
    Math.abs(emptyPieceCurrentPosY - currentPiecePosY) > 1 )
    return;

  // Also return if the piece is currently moving
  if(_isMoving)
    return 

  _isMoving = true;

  // else get new left and top for the piece
  let newX = this.offsetLeft + (emptyPieceCurrentPosX - currentPiecePosX)*pieceWidth;
  let newY = this.offsetTop + (emptyPieceCurrentPosY - currentPiecePosY)*pieceHeight;

  // swap them in pieceKeeper
  let tmp = pieceKeeper[currentPiecePosX][currentPiecePosY];
  pieceKeeper[currentPiecePosX][currentPiecePosY] = pieceKeeper[emptyPieceCurrentPosX][emptyPieceCurrentPosY];
  pieceKeeper[emptyPieceCurrentPosX][emptyPieceCurrentPosY] = tmp;  

  //animate new piece.
  TweenMax.to(this, 0.4, { left: newX, top: newY,
    onComplete: () => {
      setEmptyPiecePos(currentPiecePosX,currentPiecePosY);
      checkForWin(); 
      _isMoving = false;
    }
  });
}


function setEmptyPiecePos(x,y) {
  let left = x*pieceWidth;
  let top = y*pieceHeight;
  emptyPiece.style.left = `${left}px`;
  emptyPiece.style.top = `${top}px`;
}

function checkForWin() {
  let won = true;
  let count = 0;

  for(let i=0; i<maxRow; i++) {
    for(let j=0; j<maxColumn; j++) {
      let piece = pieceKeeper[i][j];
      if(won && piece.getAttribute("idNum")!== count.toString()) {
        won = false;
      }
      count++;
    }
  }

  if(won) {
    congratulations();
  }
}

function congratulations() {
  setGameMessage(2);
  pieceKeeper.forEach((row) => {
    row.forEach((piece) => {
      piece.removeEventListener('click', move);
    })
  });
  emptyPiece.classList.remove('black-piece');
  emptyPiece.classList.add('piece');
  TweenMax.to(emptyPiece, 0.2, { 
                opacity: 0, 
                repeat: 3,
                delay: 0.2,
                onComplete: () => {
                  TweenMax.set(emptyPiece, {opacity: 1});
                } ,
              } ); // in the end opacity will be 0!  
}

function _checkAvailableMoves(x,y, prevMove){
  let moves = [];
  if(x !== 0 && prevMove !== MOVES.LEFT)
    moves.push(MOVES.LEFT);
  if (x !== maxColumn-1 && prevMove !== MOVES.RIGHT)
    moves.push(MOVES.RIGHT);
  if(y !== 0 && prevMove !== MOVES.UP)
    moves.push(MOVES.UP);
  if(y !== maxRow-1 && prevMove !== MOVES.DOWN)
    moves.push(MOVES.DOWN);

  return moves;
}


function _chooseRandomMove(moves) {
  let numberOfMoves = moves.length;
  let moveIndex = _getRandomInt(0,(numberOfMoves-1));
  return moves[moveIndex];
}

function _shuffleMove(move, x, y) {
  let newX = x;
  let newY = y;
  switch(move) {
    case MOVES.RIGHT :
      newX = x + 1;
      break;
    case MOVES.LEFT :
      newX = x - 1;
      break;
    case MOVES.UP :
      newY = y - 1;
      break;
    case MOVES.DOWN :
      newY = y + 1;
      break;
  }

  //once we get the new cordinates of the black piece, swap it with the current piece.
  let tmp = pieceKeeper[newX][newY];
  pieceKeeper[newX][newY] = pieceKeeper[x][y];
  pieceKeeper[x][y] = tmp;  

  //After swap, update the positions of div
  pieceKeeper[newX][newY].style.left = newX*pieceWidth + "px";
  pieceKeeper[newX][newY].style.top = newY*pieceWidth + "px";
  pieceKeeper[x][y].style.left = x*pieceWidth + "px";
  pieceKeeper[x][y].style.top = y*pieceWidth + "px";

  return {x: newX, y: newY};
}

function _getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Animations:

function blink(piece) {
  let tween = TweenMax.to(piece, 0.4, { 
                opacity: 0, 
                repeat: 3,
                delay: 0.4,
                onComplete: () => {
                  piece.classList.remove('piece');
                  piece.classList.add('empty-piece');
                  TweenMax.set(piece, {opacity: 1});
                  shuffle();
                } ,
              } ); // in the end opacity will be 0!
}