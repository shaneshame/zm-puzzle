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

const isBinaryTrue = (v) => {
  return v % 2 > 0;
};

const toggleBinary = (v) => {
  return (v + 1) % 2;
};

// Board Util

const flattenBoard = (board) => {
  const flattened = [];

  board.forEach((rows) => {
    rows.forEach((value) => {
      flattened.push(value);
    });
  });

  return flattened;
};

const coordsToFlattenedIndex = (x, y, boardSize) => {
  return y * boardSize + x;
};

const flattenedIndexToCoords = (index, boardSize) => {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);

  return [x, y];
};

const clickedTilesToCoords = (clickedTiles, boardSize) => {
  const coords = [];

  clickedTiles.forEach((value, index) => {
    if (!!value) {
      coords.push(flattenedIndexToCoords(index, boardSize));
    }
  });

  return coords;
};

const getEmptyBoard = (size) => {
  return range(size).map((y) => range(size).map((x) => 0));
};

const isBoardEmpty = (board) => {
  return board.reduce((isColumnEmpty, rows) => {
    return isColumnEmpty
      ? rows.reduce((isRowEmpty, value) => {
          return isBinaryTrue(value) ? false : isRowEmpty;
        }, isColumnEmpty)
      : false;
  }, true);
};

const clickTile = (clickedX, clickedY, grid) => {
  return grid.map((rows, y) =>
    rows.map((value, x) => {
      const wasClicked = clickedX === x && clickedY === y;

      const shouldSwap = [
        wasClicked,
        clickedX === x && clickedY === y - 1,
        clickedX === x && clickedY === y + 1,
        clickedX === x + 1 && clickedY === y,
        clickedX === x - 1 && clickedY === y,
      ].some(Boolean);

      return shouldSwap ? toggleBinary(value) : value;
    }),
  );
};

const getSolutionCount = ([x, y], clickCoords) => {
  return clickCoords.reduce((curResult, [clickX, clickY], index) => {
    return clickX === x && clickY === y ? index + 1 : curResult;
  }, null);
};

const createNewGame = (boardSize, numClicks) => {
  let grid = getEmptyBoard(boardSize);
  let clickedTiles = flattenBoard(getEmptyBoard(boardSize));

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

    const clickedIndex = coordsToFlattenedIndex(clickX, clickY, boardSize);
    clickedTiles[clickedIndex] = toggleBinary(clickedTiles[clickedIndex]);
  });

  return {
    clickedTiles,
    grid,
  };
};

export {
  clickTile,
  clickedTilesToCoords,
  coordsToFlattenedIndex,
  createNewGame,
  flattenedIndexToCoords,
  getEmptyBoard,
  getRandomInt,
  getSolutionCount,
  isBinaryTrue,
  isBoardEmpty,
  isTuplePresent,
  range,
  toggleBinary,
};
