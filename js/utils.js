function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}



function createBoard(ROWS, COLS) {
    var board = []
    for (var i = 0; i < ROWS; i++) {
        board[i] = []
        for (var j = 0; j < COLS; j++) {
            board[i][j] = createCell(i, j)

        }

    }
    return board

}

function renderBoard(board, elBoard) {
    strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td ${renderCell(i, j, board)}</td>`



        }
        strHTML += '</tr>'

    }
    elBoard.innerHTML = strHTML

}



function createCell(rowIdx, colIdx, inCell = '') {
    return {
        i: rowIdx,
        j: colIdx,
        element: inCell
    }


}



function renderCell(rowIdx, colIdx, board) {
    return `class="cell-${rowIdx}-${colIdx}"> ${board[rowIdx][colIdx].element}`

}



function countNeighbors(cell, board) {
    var count = 0
    var rowIdx = cell.i
    var colIdx = cell.j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (rowIdx === i && colIdx === j) {

                continue
            }
            if (board[i][j]) {
                count++
            }

        }

    }
    return count
}



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}






function getEmptyCell(board) {
    emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].element) {
                emptyCells.push(board[i][j])

            }

        }

    }
    return emptyCells
}




