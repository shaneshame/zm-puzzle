import { flattenedIndexToCoords } from './util';

const BOARD_SIZE = 5;

describe('flattenedIndexToCoords', () => {
  test('returns correct coords', () => {
    let actual = flattenedIndexToCoords(0, BOARD_SIZE);
    let expected = [0, 0];

    expect(actual).toEqual(expected);

    actual = flattenedIndexToCoords(6, BOARD_SIZE);
    expected = [1, 1];

    expect(actual).toEqual(expected);
  });
});
