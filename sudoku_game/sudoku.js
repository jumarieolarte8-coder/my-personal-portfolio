const boardElement = document.getElementById("board");
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let grid = createBoard();

function createCells() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";

  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("input");
    cell.type = "number";
    cell.classList.add("sudoku-cell");

    const row = Math.floor(i / 9);
    const col = i % 9;

    cell.oninput = function () {
      this.value = this.value.replace(/[^1-9]/g, "");

      if (this.value.length > 1) {
        this.value = this.value.slice(0, 1);
      }

      const val = parseInt(this.value) || 0;
      grid[row][col] = val;

      if (val !== 0 && !isValid(grid, row, col, val)) {
        this.style.color = "red";
      } else {
        this.style.color = "black";
      }
    };
    boardElement.appendChild(cell);
  }
}

function createBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function isValid(grid, row, col, num) {
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
    if (grid[i][col] === num) return false;
    if (grid[startRow + Math.floor(i / 3)][startCol + (i % 3)] === num)
      return false;
  }
  return true;
}

function generateNumbers() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  const result = [];
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result.push(numbers[randomIndex]);
    numbers.splice(randomIndex, 1);
  }
  return result;
}

function generatePuzzle() {
  let board = createBoard();
  let random = generateNumbers();
  for (let i = 0; i < 81; i++) {
    board[0][i] = random[i];
  }
  return board;
}

function initialGrid() {
  grid = createBoard();

  fillBox(0, 0);
  fillBox(3, 3);
  fillBox(6, 6);

  solve(grid);

  removeNumbers(40);

  fillCells();
}

function fillBox(row, col) {
  let boxNumbers = generateNumbers();
  let index = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = boxNumbers[index];
      index++;
    }
  }
}

function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] == 0) {
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (let n of nums) {
          if (isValid(board, row, col, n)) {
            board[row][col] = n;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function removeNumbers(count) {
  let removed = 0;
  while (removed < count) {
    let i = Math.floor(Math.random() * 81);
    let row = Math.floor(i / 9);
    let col = i % 9;
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      removed++;
    }
  }
}

function fillCells() {
  const allCells = document.getElementsByClassName("sudoku-cell");

  for (let i = 0; i < 81; i++) {
    const cell = allCells[i];
    const row = Math.floor(i / 9);
    const col = i % 9;

    cell.value = "";
    cell.readOnly = false;
    cell.style.color = "black";
    cell.classList.remove("fixed-cell");

    if (grid[row][col] !== 0) {
      cell.value = grid[row][col];
      cell.readOnly = true;
      cell.classList.add("fixed-cell");
    }
  }
}

document.getElementById("restart").addEventListener("click", restartGame);
document.getElementById("hint").addEventListener("click", hintGame);
document.getElementById("newGame").onclick = function () {
  startnewGame();
};
document.getElementById("check").onclick = function () {
  checkGame();
};

function checkGame() {
  const isfull = grid.flat().every((cell) => cell !== 0);
  if (isfull) {
    alert("You win!");
  } else {
    alert("You lose!");
  }
}

function startnewGame() {
  grid = createBoard();

  initialGrid();
}

function restartGame() {
  location.reload();
}

function hintGame() {
  alert("Hint feature coming soon!");
}
createCells();
