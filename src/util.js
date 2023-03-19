// Generic

const noop = () => {};

const range = (max = 0) => {
  return [...Array(max)].map((_, index) => index);
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const isBinaryTrue = (v) => {
  return v % 2 > 0;
};

const isBinaryFalse = (v) => {
  return v % 2 === 0;
};

const toggleBinary = (v) => {
  return (v + 1) % 2;
};

// Board Util

const coordsToBoardIndex = (x, y, boardSize) => {
  return y * boardSize + x;
};

const boardIndexToCoords = (index, boardSize) => {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);

  return [x, y];
};

const boardToMatrix = (board) => {
  const matrixSize = Math.sqrt(board.length);

  let matrix = [];

  board.forEach((value, index) => {
    const [_, y] = boardIndexToCoords(index, matrixSize); // eslint-disable-line no-unused-vars

    matrix[y] = matrix[y] ?? [];

    matrix[y].push(value);
  });

  return matrix;
};

const getEmptyBoard = (size) => {
  return range(size ** 2).map(() => 0);
};

const isBoardEmpty = (board) => {
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

const clickTile = (clickedIndex, board) => {
  const boardSize = Math.sqrt(board.length);

  return board.map((value, index) => {
    const shouldSwap = [
      index === clickedIndex,
      index === getIndexAbove(clickedIndex, boardSize),
      index === getIndexBelow(clickedIndex, boardSize),
      index === getIndexLeft(clickedIndex, boardSize),
      index === getIndexRight(clickedIndex, boardSize),
    ].some(Boolean);

    return shouldSwap ? toggleBinary(value) : value;
  });
};

const clickManyTiles = (indices, board, callback = noop) => {
  let newBoard = [...board];

  indices.forEach((index) => {
    newBoard = clickTile(index, newBoard);
    callback(index);
  });

  return newBoard;
};

const getUniqueIndices = (count, length) => {
  const uniqueIndices = new Set();

  for (let index = 0; index < count; index += 1) {
    let nextIndex = getRandomInt(length);

    while (uniqueIndices.has(nextIndex)) {
      nextIndex = getRandomInt(length);
    }

    uniqueIndices.add(nextIndex);
  }

  return [...uniqueIndices];
};

const createNewGame = (boardSize, numClicks) => {
  let board = getEmptyBoard(boardSize);
  let clickedTiles = getEmptyBoard(boardSize);

  const clickIndices = getUniqueIndices(numClicks, boardSize ** 2);

  board = clickManyTiles(clickIndices, board, (clickedIndex) => {
    clickedTiles[clickedIndex] = toggleBinary(clickedTiles[clickedIndex]);
  });

  return {
    board,
    boardSize,
    clickedTiles,
  };
};

export {
  boardIndexToCoords,
  boardToMatrix,
  clickTile,
  coordsToBoardIndex,
  createNewGame,
  getEmptyBoard,
  getIndexAbove,
  getIndexBelow,
  getIndexLeft,
  getIndexRight,
  getRandomInt,
  isBinaryTrue,
  isBoardEmpty,
  range,
  toggleBinary,
};
