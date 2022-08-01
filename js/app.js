'use strict'
var gBallInterval
var gGlueInterval
var gRemoveGlueInterval
var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GLUE = 'GLUE'
var GAMER = 'GAMER';
var gAddBallsCounter
var gCounterBall
var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/glue.png" />';
var restart = document.querySelector('.restart')
var gBoard;
var gGamerPos;
var isWalking = true

function initGame() {
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    // gBoard[0][5] =  { type: FLOOR, gameElement: null }
    // gBoard[9][5] =  { type: FLOOR, gameElement: null }
    // gBoard[5][11] =  { type: FLOOR, gameElement: null }
    // gBoard[5][0] =  { type: FLOOR, gameElement: null }
    renderBoard(gBoard);
    gBallInterval = setInterval(addBall, 1200)
    gGlueInterval = setInterval(addGlue, 5000)
    restart.style.display = 'none'

    gAddBallsCounter = 2
    gCounterBall = 0
}


function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)


    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null };

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Balls (currently randomly chosen positions)
    board[3][8].gameElement = BALL;
    board[7][4].gameElement = BALL;


    // Add 4 passages


    board[0][5] = { type: FLOOR, gameElement: null, passage: "A1" }
    board[9][5] = { type: FLOOR, gameElement: null, passage: "A2" }
    board[5][11] = { type: FLOOR, gameElement: null, passage: "B1" }
    board[5][0] = { type: FLOOR, gameElement: null, passage: "B2" }

    return board;
}

// Render the board to an HTML table
function renderBoard(board) {


    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`;

            // TODO - change to switch case statement
            if (currCell.gameElement === GAMER) {

                strHTML += GAMER_IMG;

            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }
            else if (currCell.gameElement === GLUE) {
                strHTML += GLUE_IMG
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

    if (!isWalking) return
    var targetCell = gBoard[i][j];
    if (targetCell.type === WALL) return;


    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || (jAbsDiff === gBoard[0].length - 1 && iAbsDiff === 0) || (iAbsDiff === gBoard.length - 1 && jAbsDiff === 0)) {

        if (targetCell.gameElement === BALL) {
            playAudio()
            gAddBallsCounter--

            gCounterBall++
            if (gAddBallsCounter === 0) {
                clearInterval(gBallInterval)

                restart.style.display = 'block'
            }
        }
        else if (targetCell.gameElement === GLUE) {
            isWalking = false
            setTimeout(() => isWalking = true, 3000)
        }

        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;

        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            if (j <= 0) moveTo(i, 11)
            else moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            if (j >= 11) moveTo(i, 0)
            else moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            if (i <= 0) moveTo(9, j)
            else moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            if (i >= 9) moveTo(0, j)
            else moveTo(i + 1, j);
            break;

    }

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}


function addBall() {
    var i = getRandomInt(1, 9)
    var j = getRandomInt(1, 11)

    if (gBoard[i][j].gameElement === null) {

        gBoard[i][j].gameElement = BALL;
        renderBoard(gBoard)
        gAddBallsCounter++

    }

}

function playAudio() {
    var audio = new Audio('/audio/collect.mp3')
    audio.play()
}

function addGlue() {
    

    var i = getRandomInt(1, 9)
    var j = getRandomInt(1, 11)

    if (gBoard[i][j].gameElement === null) {

        gBoard[i][j].gameElement = GLUE;
        setTimeout(function () { if (gBoard[i][j].gameElement !== GAMER) { gBoard[i][j].gameElement = null } else { gBoard[i][j].gameElement = GAMER } }, 3000)

        renderBoard(gBoard)


    }
}

// function keepWalk() {
//     isWalking = true
    


// }

