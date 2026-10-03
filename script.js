// ==========================================
// 3D SUDOKU SOLVER
// ==========================================


// Get HTML elements

const sudokuGrid =
    document.getElementById("sudokuGrid");

const solveButton =
    document.getElementById("solveButton");

const clearButton =
    document.getElementById("clearButton");

const message =
    document.getElementById("message");


// ==========================================
// CREATE THE 9 x 9 GRID
// ==========================================

for (let row = 0; row < 9; row++) {

    for (let col = 0; col < 9; col++) {

        const cell =
            document.createElement("input");

        cell.type = "text";

        cell.className = "cell";

        cell.maxLength = 1;

        cell.inputMode = "numeric";

        cell.dataset.row = row;

        cell.dataset.col = col;


        // Only allow numbers 1-9

        cell.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^1-9]/g,
                        ""
                    );

                // Remove solved styling
                this.classList.remove(
                    "solved"
                );
            }
        );


        sudokuGrid.appendChild(cell);
    }
}


// ==========================================
// GET GRID FROM THE PAGE
// ==========================================

function getGrid() {

    const cells =
        document.querySelectorAll(".cell");

    const grid = [];


    for (let row = 0; row < 9; row++) {

        grid[row] = [];


        for (let col = 0; col < 9; col++) {

            const index =
                row * 9 + col;

            const value =
                cells[index].value.trim();


            if (value === "") {

                grid[row][col] = 0;

            } else {

                grid[row][col] =
                    Number(value);
            }
        }
    }


    return grid;
}


// ==========================================
// CHECK WHETHER A NUMBER CAN BE PLACED
// ==========================================

function isValid(grid, row, col, number) {

    // Check the row

    for (let c = 0; c < 9; c++) {

        if (grid[row][c] === number) {
            return false;
        }
    }


    // Check the column

    for (let r = 0; r < 9; r++) {

        if (grid[r][col] === number) {
            return false;
        }
    }


    // Find the top-left corner
    // of the 3x3 box

    const boxRow =
        Math.floor(row / 3) * 3;

    const boxCol =
        Math.floor(col / 3) * 3;


    // Check the 3x3 box

    for (
        let r = boxRow;
        r < boxRow + 3;
        r++
    ) {

        for (
            let c = boxCol;
            c < boxCol + 3;
            c++
        ) {

            if (
                grid[r][c] === number
            ) {
                return false;
            }
        }
    }


    return true;
}


// ==========================================
// FIND AN EMPTY CELL
// ==========================================

function findEmptyCell(grid) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (grid[row][col] === 0) {

                return {
                    row: row,
                    col: col
                };
            }
        }
    }


    return null;
}


// ==========================================
// VALIDATE THE STARTING PUZZLE
// ==========================================

function isInitialGridValid(grid) {

    // Check every filled cell

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const number =
                grid[row][col];


            // Ignore empty cells

            if (number === 0) {
                continue;
            }


            // Temporarily remove the number

            grid[row][col] = 0;


            const valid =
                isValid(
                    grid,
                    row,
                    col,
                    number
                );


            // Put it back

            grid[row][col] =
                number;


            if (!valid) {
                return false;
            }
        }
    }


    return true;
}


// ==========================================
// SUDOKU BACKTRACKING ALGORITHM
// ==========================================

function solveSudoku(grid) {

    // Find an empty cell

    const emptyCell =
        findEmptyCell(grid);


    // If there are no empty cells,
    // the Sudoku is solved

    if (emptyCell === null) {
        return true;
    }


    const row =
        emptyCell.row;

    const col =
        emptyCell.col;


    // Try numbers 1 through 9

    for (
        let number = 1;
        number <= 9;
        number++
    ) {

        // Check whether number is valid

        if (
            isValid(
                grid,
                row,
                col,
                number
            )
        ) {

            // Place number

            grid[row][col] =
                number;


            // Recursively continue

            if (
                solveSudoku(grid)
            ) {

                return true;
            }


            // Backtrack if necessary

            grid[row][col] = 0;
        }
    }


    // No solution from this path

    return false;
}


// ==========================================
// DISPLAY THE SOLUTION
// ==========================================

function displayGrid(
    solvedGrid,
    originalGrid
) {

    const cells =
        document.querySelectorAll(".cell");


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const index =
                row * 9 + col;


            cells[index].value =
                solvedGrid[row][col];


            // Highlight cells that
            // the program filled in

            if (
                originalGrid[row][col] === 0
            ) {

                cells[index]
                    .classList
                    .add("solved");

            } else {

                cells[index]
                    .classList
                    .remove("solved");
            }
        }
    }
}


// ==========================================
// SOLVE BUTTON
// ==========================================

solveButton.addEventListener(
    "click",
    function () {

        // Clear previous message

        message.textContent = "";

        message.className = "";


        // Get puzzle

        const grid =
            getGrid();


        // Save original puzzle

        const originalGrid =
            grid.map(
                row => [...row]
            );


        // Check whether starting puzzle
        // is valid

        if (
            !isInitialGridValid(grid)
        ) {

            message.textContent =
                "❌ Invalid puzzle. There are duplicate numbers.";

            message.className =
                "error";

            return;
        }


        // Solve puzzle

        const solved =
            solveSudoku(grid);


        if (solved) {

            // Show solution

            displayGrid(
                grid,
                originalGrid
            );


            message.textContent =
                "🎉 Sudoku solved successfully!";

            message.className =
                "success";

        } else {

            message.textContent =
                "❌ This Sudoku has no solution.";

            message.className =
                "error";
        }
    }
);


// ==========================================
// CLEAR BUTTON
// ==========================================

clearButton.addEventListener(
    "click",
    function () {

        const cells =
            document.querySelectorAll(".cell");


        cells.forEach(
            function (cell) {

                cell.value = "";

                cell.classList.remove(
                    "solved"
                );
            }
        );


        message.textContent = "";

        message.className = "";
    }
);