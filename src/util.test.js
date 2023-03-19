import {
  boardIndexToCoords,
  clickTile,
  getIndexAbove,
  getIndexBelow,
  getIndexLeft,
  getIndexRight,
} from './util';

const BOARD_SIZE = 5;

test('boardIndexToCoords', () => {
  let actual = boardIndexToCoords(0, BOARD_SIZE);
  let expected = [0, 0];

  expect(actual).toEqual(expected);

  actual = boardIndexToCoords(6, BOARD_SIZE);
  expected = [1, 1];

  expect(actual).toEqual(expected);
});

test('getIndexAbove', () => {
  let index = 0;
  let actual = getIndexAbove(index, BOARD_SIZE);
  let expected = null;

  expect(actual).toBe(expected);

  index = 5;
  actual = getIndexAbove(index, BOARD_SIZE);
  expected = 0;

  expect(actual).toBe(expected);

  index = 6;
  actual = getIndexAbove(index, BOARD_SIZE);
  expected = 1;

  expect(actual).toBe(expected);

  index = 10;
  actual = getIndexAbove(index, BOARD_SIZE);
  expected = 5;

  expect(actual).toBe(expected);

  index = 17;
  actual = getIndexAbove(index, BOARD_SIZE);
  expected = 12;

  expect(actual).toBe(expected);
});

test('getIndexBelow', () => {
  let index = 0;
  let actual = getIndexBelow(index, BOARD_SIZE);
  let expected = 5;

  expect(actual).toBe(expected);

  index = 4;
  actual = getIndexBelow(index, BOARD_SIZE);
  expected = 9;

  expect(actual).toBe(expected);

  index = 10;
  actual = getIndexBelow(index, BOARD_SIZE);
  expected = 15;

  expect(actual).toBe(expected);

  index = 20;
  actual = getIndexBelow(index, BOARD_SIZE);
  expected = null;

  expect(actual).toBe(expected);

  index = 24;
  actual = getIndexBelow(index, BOARD_SIZE);
  expected = null;

  expect(actual).toBe(expected);
});

test('getIndexLeft', () => {
  let index = 0;
  let actual = getIndexLeft(index, BOARD_SIZE);
  let expected = null;

  expect(actual).toBe(expected);

  index = 5;
  actual = getIndexLeft(index, BOARD_SIZE);
  expected = null;

  expect(actual).toBe(expected);

  index = 1;
  actual = getIndexLeft(index, BOARD_SIZE);
  expected = 0;

  expect(actual).toBe(expected);

  index = 21;
  actual = getIndexLeft(index, BOARD_SIZE);
  expected = 20;

  expect(actual).toBe(expected);
});

test('getIndexRight', () => {
  let index = 0;
  let actual = getIndexRight(index, BOARD_SIZE);
  let expected = 1;

  expect(actual).toBe(expected);

  index = 5;
  actual = getIndexRight(index, BOARD_SIZE);
  expected = 6;

  expect(actual).toBe(expected);

  index = 17;
  actual = getIndexRight(index, BOARD_SIZE);
  expected = 18;

  expect(actual).toBe(expected);

  index = 20;
  actual = getIndexRight(index, BOARD_SIZE);
  expected = 21;

  expect(actual).toBe(expected);

  index = 4;
  actual = getIndexRight(index, BOARD_SIZE);
  expected = null;

  expect(actual).toBe(expected);

  index = 24;
  actual = getIndexRight(index, BOARD_SIZE);
  expected = null;

  expect(actual).toBe(expected);
});

test('clickTile', () => {
  const emptyBoard = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  let clickIndex = 0;
  let actual = clickTile(clickIndex, emptyBoard);
  let expected = [
    1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  expect(actual).toEqual(expected);

  clickIndex = 7;
  actual = clickTile(clickIndex, emptyBoard);
  expected = [
    0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  expect(actual).toEqual(expected);

  clickIndex = 22;
  actual = clickTile(clickIndex, emptyBoard);
  expected = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0,
  ];

  expect(actual).toEqual(expected);

  clickIndex = 13;
  actual = clickTile(clickIndex, emptyBoard);
  expected = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  ];

  expect(actual).toEqual(expected);
});
