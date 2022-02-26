import { v4 as uuidv4 } from "uuid";

// Generic

const range = (max = 0) => {
  return [...Array(max)].map((_, index) => index);
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const isTuplePresent = ([a, b], tuples) => {
  return tuples.reduce((isPresent, [curA, curB]) => {
    return isPresent || (curA === a && curB === b);
  }, false);
};

// Board Util

const genEmptyBoard = (size) => {
  return range(size).map((y) =>
    range(size).map((x) => ({
      isSelected: false,
      x,
      y,
    }))
  );
};

const isBoardEmpty = (board) => {
  return board.reduce((isColumnEmpty, rows) => {
    return isColumnEmpty
      ? rows.reduce((isRowEmpty, { isSelected }) => {
          return isSelected ? false : isRowEmpty;
        }, isColumnEmpty)
      : false;
  }, true);
};

const clickTile = (clickedX, clickedY, grid) => {
  return grid.map((rows) =>
    rows.map(({ isSelected, solution, x, y, ...rest }) => {
      const wasClicked = clickedX === x && clickedY === y;

      const shouldSwap = [
        wasClicked,
        clickedX === x && clickedY === y - 1,
        clickedX === x && clickedY === y + 1,
        clickedX === x + 1 && clickedY === y,
        clickedX === x - 1 && clickedY === y,
      ].some(Boolean);

      return {
        ...rest,
        isSelected: shouldSwap ? !isSelected : isSelected,
        solution: wasClicked ? null : solution,
        x,
        y,
      };
    })
  );
};

const getSolutionCount = (tile, clickCoords) => {
  return clickCoords.reduce((curResult, [x, y], index) => {
    return x === tile.x && y === tile.y ? index + 1 : curResult;
  }, null);
};

const setSolutions = (game) => {
  const solvedGrid = game.grid.map((rows) => {
    return rows.map((tile) => {
      return {
        ...tile,
        solution: getSolutionCount(tile, game.clickCoords),
      };
    });
  });

  return {
    ...game,
    grid: solvedGrid,
  };
};

const createNewGame = (boardSize, numClicks) => {
  let grid = genEmptyBoard(boardSize);

  let clickCoords = [];

  for (let click = 0; click < numClicks; click += 1) {
    let nextClickCoords = [getRandomInt(boardSize), getRandomInt(boardSize)];

    while (isTuplePresent(nextClickCoords, clickCoords)) {
      nextClickCoords = [getRandomInt(boardSize), getRandomInt(boardSize)];
    }

    clickCoords = [...clickCoords, nextClickCoords];
  }

  clickCoords.forEach(([clickX, clickY]) => {
    grid = clickTile(clickX, clickY, grid);
  });

  return { clickCoords, grid, timestamp: uuidv4() };
};

export {
  clickTile,
  createNewGame,
  genEmptyBoard,
  getRandomInt,
  isBoardEmpty,
  isTuplePresent,
  range,
  setSolutions,
};
