var table;
var puzzle = []
var solution = []
var remaining = [9, 9, 9, 9, 9, 9, 9, 9, 9]

function getGridInit() {
    var rand = [];
    for (var i = 1; i <= 9; i++) {
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        var accept = true;
        for (var j = 0; j < rand.length; j++) {
            if (rand[j][0] == i | (rand[j][1] == row & rand[j][2] == col)) {
                accept = false;
                i--;
                break;
            }
        }
        if (accept) {
            rand.push([i, row, col]);
        }
    }
    var result = [];
    for (var i = 0; i < 9; i++) {
        var row = "000000000";
        result.push(row);
    }
    for (var i = 0; i < rand.length; i++) {
        result[rand[i][1]] = replaceCharAt(result[rand[i][1]], rand[i][2], rand[i][0]);
    }

    return result;
}

function getColumns(grid) {
    var result = ["", "", "", "", "", "", "", "", ""];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++)
            result[j] += grid[i][j];
    }
    return result;
}

function getBlocks(grid) {
    var result = ["", "", "", "", "", "", "", "", ""];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++)
            result[Math.floor(i / 3) * 3 + Math.floor(j / 3)] += grid[i][j];
    }
    return result;
}

// function to replace char in string
function replaceCharAt(string, index, char) {
    if (index > string.length - 1) 
        return string;
    else
        return string.substr(0, index) + char + string.substr(index + 1);
}

// get allowed numbers that can be placed in each cell
function generatePossibleNumber(rows, columns, blocks) {
    var psb = [];

    // for each cell get numbers that are not viewed in a row, column or block
    // if the cell is not empty then, allowed number is the number already exist in it
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            psb[i * 9 + j] = "";
            if (rows[i][j] != 0) {
                psb[i * 9 + j] += rows[i][j];
            } else {
                for (var k = '1'; k <= '9'; k++) {
                    if (!rows[i].includes(k))
                        if (!columns[j].includes(k))
                            if (!blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].includes(k))
                                psb[i * 9 + j] += k;
                }
            }
        }
    }
    return psb;
}

function solveGrid(possibleNumber, rows, startFromZero) {
    var solution = [];
    var result = nextStep(0, possibleNumber, rows, solution, startFromZero);
    if (result == 1)
        return solution;
}

 // level is current row number in the grid
 function nextStep(level, possibleNumber, rows, solution, startFromZero) {
    // get possible number fit in each cell in this row
    var x = possibleNumber.slice(level * 9, (level + 1) * 9);

    // generate possible numbers sequence that fit in the current row
    var y = generatePossibleRows(x);
    if (y.length == 0)
        return 0;

    // to allow check is solution is unique
    var start = startFromZero ? 0 : y.length - 1;
    var stop = startFromZero ? y.length - 1 : 0;
    var step = startFromZero ? 1 : -1;
    var condition = startFromZero ? (start <= stop) : (start >= stop);

    // try every numbers sequence in this list and go to next row
    for (var num = start; condition; num += step) {
        var condition = startFromZero ? (num + step <= stop) : (num + step >= stop);
        for (var i = level + 1; i < 9; i++)
            solution[i] = rows[i];
            solution[level] = y[num];
        if (level < 8) {
            var cols = getColumns(solution);
            var blocks = getBlocks(solution);

            var poss = generatePossibleNumber(solution, cols, blocks);
            if (nextStep(level + 1, poss, rows, solution, startFromZero) == 1)
                return 1;
        }
        if (level == 8)
            return 1;
    }
    return -1;
}
// generate possible numbers sequence that fit in the current row
function generatePossibleRows(possibleNumber) {
    var result = [];
    function step(level, PossibleRow) {
        if (level == 9) {
            result.push(PossibleRow);
            return;
        }
        for (var i in possibleNumber[level]) {
            if (PossibleRow.includes(possibleNumber[level][i]))
                continue;
            step(level + 1, PossibleRow + possibleNumber[level][i]);
        }
    }
    step(0, "");
    return result;
}
// update value of remaining numbers
function updateRemainingTable() {
    for (var i = 1; i < 10; i++) {
        var item = document.getElementById("remain-" + i);
        item.innerText = remaining[i - 1];
        item.classList.remove("red");
        item.classList.remove("gray");
        if (remaining[i - 1] === 0)
            item.classList.add("gray");
        else if (remaining[i - 1] < 0 || remaining[i - 1] > 9)
            item.classList.add("red");
    }
}
// solve
function solveClick() {

    if (gameOn) {
        // reset remaining number table
        for (var i in remaining)
            remaining[i] = 9;

        // review puzzle
        ViewPuzzle(solution);

        // update remaining numbers table
        updateRemainingTable();
    }
}