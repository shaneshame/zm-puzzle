import {
  boardIndexToCoords,
  boardToMatrix,
  chunk,
  clickTile,
  clickManyTiles,
  getEmptyBoard,
  getIndexAbove,
  getIndexBelow,
  getIndexLeft,
  getIndexRight,
  range,
} from './util';

describe('Utility Functions', () => {
  test('range', () => {
    let size = 9;
    let actual = range(size);
    let expected = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    expect(actual).toEqual(expected);
  });

  describe('chunk', () => {
    test('should handle odd number in final chunk', () => {
      const list = range(8);
      const size = 3;

      const actual = chunk(list, size);
      const expected = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7],
      ];

      expect(actual).toEqual(expected);
    });

    test('should handle even number chunks', () => {
      const list = range(12);
      const size = 4;

      const actual = chunk(list, size);
      const expected = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
      ];

      expect(actual).toEqual(expected);
    });
  });

  const a;

  test('boardIndexToCoords', () => {
    const boardSize = 5;

    let actual = boardIndexToCoords(0, boardSize);
    let expected = { x: 0, y: 0 };

    expect(actual).toEqual(expected);

    actual = boardIndexToCoords(6, boardSize);
    expected = { x: 1, y: 1 };

    expect(actual).toEqual(expected);
  });

  test('getEmptyBoard', () => {
    const boardSize = 5;
    let emptyBoard = getEmptyBoard(boardSize);

    let expected = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    expect(emptyBoard).toEqual(expected);
  });

  test('boardToMatrix', () => {
    const boardSize = 5;
    let emptyBoard = getEmptyBoard(boardSize);

    let matrix = boardToMatrix(emptyBoard);

    let expected = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    expect(matrix).toEqual(expected);
  });
});

describe('Click Tile', () => {
  test('clickTile', () => {
    const boardSize = 5;
    const emptyBoard = getEmptyBoard(boardSize);

    let clickIndex = 0;
    let newBoard = clickTile(clickIndex, emptyBoard);
    let expected = [
      1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    expect(newBoard).toEqual(expected);

    clickIndex = 7;
    newBoard = clickTile(clickIndex, emptyBoard);
    expected = [
      0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    expect(newBoard).toEqual(expected);

    clickIndex = 22;
    newBoard = clickTile(clickIndex, emptyBoard);
    expected = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0,
    ];

    expect(newBoard).toEqual(expected);

    clickIndex = 13;
    newBoard = clickTile(clickIndex, emptyBoard);
    expected = [
      0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    ];

    expect(newBoard).toEqual(expected);
  });

  test('clickManyTiles', () => {
    const boardSize = 5;
    const emptyBoard = getEmptyBoard(boardSize);

    let indices = [7, 11, 0, 6, 22];

    let newBoard = clickManyTiles(indices, emptyBoard);
    let expected = [
      1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0,
    ];

    expect(newBoard).toEqual(expected);

    indices = [10, 0, 8, 11, 17];

    newBoard = clickManyTiles(indices, emptyBoard);
    expected = [
      1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0,
    ];

    expect(newBoard).toEqual(expected);
  });

  test('getIndexAbove', () => {
    const boardSize = 5;

    let index = 0;
    let actual = getIndexAbove(index, boardSize);
    let expected = null;

    expect(actual).toBe(expected);

    index = 5;
    actual = getIndexAbove(index, boardSize);
    expected = 0;

    expect(actual).toBe(expected);

    index = 6;
    actual = getIndexAbove(index, boardSize);
    expected = 1;

    expect(actual).toBe(expected);

    index = 10;
    actual = getIndexAbove(index, boardSize);
    expected = 5;

    expect(actual).toBe(expected);

    index = 17;
    actual = getIndexAbove(index, boardSize);
    expected = 12;

    expect(actual).toBe(expected);
  });

  test('getIndexBelow', () => {
    const boardSize = 5;

    let index = 0;
    let actual = getIndexBelow(index, boardSize);
    let expected = 5;

    expect(actual).toBe(expected);

    index = 4;
    actual = getIndexBelow(index, boardSize);
    expected = 9;

    expect(actual).toBe(expected);

    index = 10;
    actual = getIndexBelow(index, boardSize);
    expected = 15;

    expect(actual).toBe(expected);

    index = 20;
    actual = getIndexBelow(index, boardSize);
    expected = null;

    expect(actual).toBe(expected);

    index = 24;
    actual = getIndexBelow(index, boardSize);
    expected = null;

    expect(actual).toBe(expected);
  });

  test('getIndexLeft', () => {
    const boardSize = 5;

    let index = 0;
    let actual = getIndexLeft(index, boardSize);
    let expected = null;

    expect(actual).toBe(expected);

    index = 5;
    actual = getIndexLeft(index, boardSize);
    expected = null;

    expect(actual).toBe(expected);

    index = 1;
    actual = getIndexLeft(index, boardSize);
    expected = 0;

    expect(actual).toBe(expected);

    index = 21;
    actual = getIndexLeft(index, boardSize);
    expected = 20;

    expect(actual).toBe(expected);
  });

  test('getIndexRight', () => {
    const boardSize = 5;

    let index = 0;
    let actual = getIndexRight(index, boardSize);
    let expected = 1;

    expect(actual).toBe(expected);

    index = 5;
    actual = getIndexRight(index, boardSize);
    expected = 6;

    expect(actual).toBe(expected);

    index = 17;
    actual = getIndexRight(index, boardSize);
    expected = 18;

    expect(actual).toBe(expected);

    index = 20;
    actual = getIndexRight(index, boardSize);
    expected = 21;

    expect(actual).toBe(expected);

    index = 4;
    actual = getIndexRight(index, boardSize);
    expected = null;

    expect(actual).toBe(expected);

    index = 24;
    actual = getIndexRight(index, boardSize);
    expected = null;

    expect(actual).toBe(expected);
  });
});
