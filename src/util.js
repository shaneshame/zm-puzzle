// Generic

const noop = () => {};

const identity = (v) => v;

const range = (min, max, step) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  step = step || (min < max ? 1 : -1);

  const length = Math.max(Math.ceil((max - min) / (step || 1)), 0);

  return [...Array(length)].map((_, index) => min + index * step);
};

const chunk = (arr = [], size = 1) => {
  return arr.reduce((accumulator, value, index) => {
    const chunkIndex = Math.floor(index / size);
    const currentChunk = accumulator[chunkIndex] || [];

    currentChunk.push(value);

    accumulator[chunkIndex] = currentChunk;

    return accumulator;
  }, []);
};

const getRandomInt = (max = 1) => {
  return Math.floor(Math.random() * max);
};

const binary = (value) => {
  return value ? 1 : 0;
};

const isBinaryTrue = (v) => {
  return binary(v) % 2 > 0;
};

const isBinaryFalse = (v) => {
  return binary(v) % 2 === 0;
};

const toggleBinary = (v) => {
  return (binary(v) + 1) % 2;
};

const countTrue = (arr = []) => {
  return arr.filter(Boolean).length;
};

// Board Util

const coordsToBoardIndex = (x, y, boardSize) => {
  return y * boardSize + x;
};

const boardIndexToCoords = (index, boardSize) => {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);

  return { x, y };
};

const getBoardSize = (board) => {
  return board ? Math.sqrt(board.length) : 0;
};

const boardToMatrix = (board = []) => {
  const matrixSize = getBoardSize(board);
  return chunk(board, matrixSize);
};

const getEmptyBoard = (size = 0) => {
  return range(size ** 2).map(() => 0);
};

const isBoardEmpty = (board = []) => {
  return board.every(isBinaryFalse);
};

const getIndexAbove = (index, boardSize) => {
  return index > boardSize - 1 ? index - boardSize : null;
};

const getIndexBelow = (index, boardSize) => {
  return index < boardSize ** 2 - boardSize ? index + boardSize : null;
};

const getIndexLeft = (index, boardSize) => {
  return index % boardSize > 0 ? index - 1 : null;
};

const getIndexRight = (index, boardSize) => {
  return (index + 1) % boardSize > 0 ? index + 1 : null;
};

const clickTile = (clickedIndex, board = []) => {
  const boardSize = Math.sqrt(board.length);

  return board.map((value, index) => {
    const shouldToggle = [
      index === clickedIndex,
      index === getIndexAbove(clickedIndex, boardSize),
      index === getIndexBelow(clickedIndex, boardSize),
      index === getIndexLeft(clickedIndex, boardSize),
      index === getIndexRight(clickedIndex, boardSize),
    ].some(Boolean);

    return shouldToggle ? toggleBinary(value) : value;
  });
};

const clickManyTiles = (indices, board, callback = noop) => {
  return indices.reduce(
    (curBoard, indexClicked, clickCount) => {
      callback(indexClicked, clickCount);

      return clickTile(indexClicked, curBoard);
    },
    [...board],
  );
};

const getIndexSet = (count, maxIndex) => {
  const uniqueIndices = new Set();

  while (uniqueIndices.size < Math.min(count, maxIndex)) {
    uniqueIndices.add(getRandomInt(maxIndex));
  }

  return uniqueIndices;
};

const getNewClickedTiles = (boardSize, numClicks) => {
  const indexSet = getIndexSet(numClicks, boardSize ** 2);

  return getEmptyBoard(boardSize).map((_, index) =>
    binary(indexSet.has(index)),
  );
};

const getBoardFromClickedTiles = (clickedTiles = []) => {
  if (clickedTiles.length === 0) {
    console.log('[getBoardFromClickedTiles] null return');
    return [];
  }

  const boardSize = Math.sqrt(clickedTiles.length);

  const clickedIndices = clickedTiles.reduce((acc, value, index) => {
    return isBinaryTrue(value) ? [...acc, index] : acc;
  }, []);

  return clickManyTiles(clickedIndices, getEmptyBoard(boardSize));
};

export {
  boardIndexToCoords,
  boardToMatrix,
  chunk,
  clickManyTiles,
  clickTile,
  coordsToBoardIndex,
  countTrue,
  getBoardFromClickedTiles,
  getBoardSize,
  getEmptyBoard,
  getIndexAbove,
  getIndexBelow,
  getIndexLeft,
  getIndexRight,
  getIndexSet,
  getNewClickedTiles,
  getRandomInt,
  identity,
  isBinaryTrue,
  isBinaryFalse,
  isBoardEmpty,
  noop,
  range,
  toggleBinary,
};
