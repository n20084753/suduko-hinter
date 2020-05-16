/** 
 * Chrome extension for quickly add pencil marks to sudoku.com problems
 */

(function () {
    "use strict";

    const matrix = [...Array(9)].map((e) => Array(9));

    let selectedRow;
    let selectedColumn;

    const buildSudokuMatrix = ($gameCells) => {
        let i = 0;
        
        for (const $gameCell of $gameCells) {
            let $cellValue = $gameCell.querySelector('.cell-value');

            let row = Math.floor(i / 9);
            let column = i % 9;

            if ($gameCell.classList.contains('cell-selected')) {
                selectedRow = row;
                selectedColumn = column;
            }

            matrix[row][column] = $gameCell.querySelector('.pencil-grid');;
            if ($cellValue.querySelector('path')) {
                let pathValue = $cellValue
                    .querySelector('path')
                    .getAttribute('d');

                matrix[row][column] = CELL_PATH_TO_VALUE_MAP[pathValue];
            }
            i++;
        }        
    }

    const getColumnValues = (column) => {
        let columnValues = [];
        for (let i = 0; i < 9; i++) {
            if (typeof matrix[i][column] === "string") {
                columnValues.push(+matrix[i][column]);
            }
        }

        return columnValues;
    };

    const getRowValues = (row) => {
        let rowValues = [];
        for (let i = 0; i < 9; i++) {
            if (typeof matrix[row][i] === "string") {
                rowValues.push(+matrix[row][i]);
            }
        }

        return rowValues;
    };

    // Get the value in the 3X3 container
    const getContainerValues = (row, column) => {
        let containerValues = [];
        
        let containerRowIndex = Math.floor(row / 3) * 3;
        let containerColumnIndex = Math.floor(column / 3) * 3;
        for (let i = containerRowIndex; i < containerRowIndex + 3; i++) {
            for (let j = containerColumnIndex; j < containerColumnIndex + 3; j++) {
                if (typeof matrix[i][j] === 'string') {
                    containerValues.push(+matrix[i][j]);
                }
            }
        }

        return containerValues;
    }

    const fillPencilMarkOnCell = (row, column) => {
        let rowValues = getRowValues(row);
        let columnValues = getColumnValues(column);
        let containerValues = getContainerValues(row, column);

        let impossibleValues = [...new Set([
            ...rowValues,
            ...columnValues,
            ...containerValues
        ])];

        for (let i = 1; i <= 9; i++) {
            let subGridCell = matrix[row][column]
                .querySelector(`.pencil-grid-cell-${i}`);
            if (!impossibleValues.includes(i)) {
                subGridCell.innerHTML = PENCIL_VALUE_TO_SVG_MAP[i];
                subGridCell.classList.add('hasValue');
            } else {
                subGridCell.innerHTML = `<svg></svg>`;
                subGridCell.classList.remove('hasValue');
            }
        }

    };

    const process = () => {
        const $gameCells = document.querySelectorAll('.game-cell');

        buildSudokuMatrix($gameCells);

        if (typeof selectedRow !== 'undefined'
            && typeof matrix[selectedRow][selectedColumn] === "object"
        ) {
            fillPencilMarkOnCell(selectedRow, selectedColumn);
            return;
        }

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (typeof matrix[i][j] === "object") {
                    fillPencilMarkOnCell(i, j);
                }
            }
        }
    };

    const clearMarks = () => {
        const $pencilMarks = document.querySelectorAll('.pencil-grid-cell');

        $pencilMarks.forEach($pencilMark => {
            $pencilMark.innerHTML = `<svg></svg>`;
            $pencilMark.classList.remove('hasValue');
        });
    }

    chrome.runtime.onMessage.addListener((message) => {
        if (message === 'refreshPencilMarks') {        
            process();
        }

        if (message === 'clearPencilMarks') {
            clearMarks();
        }
    });    
})();