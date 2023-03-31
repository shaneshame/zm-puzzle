import {
  cond,
  isEmpty,
  flow,
  stubTrue,
  queryString,
  updateUrlQuery,
} from './util';

describe('isEmpty', () => {
  test('should handle strings', () => {
    const actual = isEmpty('');
    const expected = true;

    expect(actual).toBe(expected);
  });
});

describe('updateUrlQuery', () => {
  test('should not change with no query', () => {
    const baseUrl = 'https://en.wikipedia.org/wiki/Rickrolling';

    const actual = updateUrlQuery(baseUrl);
    const expected = baseUrl;

    expect(actual).toBe(expected);
  });

  test('should update query', () => {
    const baseUrl =
      'https://en.wikipedia.org/w/index.php?title=Rickrolling&action=edit';

    const newQuery = 'title=RickRollRickRoll&data=1,2,3,4,5';

    const actual = updateUrlQuery(baseUrl, newQuery);
    const expected =
      'https://en.wikipedia.org/w/index.php?title=RickRollRickRoll&data=1,2,3,4,5';

    expect(actual).toBe(expected);
  });

  test('should retain hash', () => {
    const baseUrl =
      'https://en.wikipedia.org/wiki/Rickrolling?title=Rickrolling#Later_usage';

    const newQuery = 'title=RickRollRickRoll&data=1,2,3,4,5';

    const actual = updateUrlQuery(baseUrl, newQuery);
    const expected =
      'https://en.wikipedia.org/wiki/Rickrolling?title=RickRollRickRoll&data=1,2,3,4,5#Later_usage';

    expect(actual).toBe(expected);
  });

  test('should handle non-typical URLs', () => {
    const oddUrl = 'https://subdomain.domain.com/url=?https://example.com';

    const newQuery = 'https://google.com';

    const actual = updateUrlQuery(oddUrl, newQuery);
    const expected = 'https://subdomain.domain.com/url=?https://google.com';

    expect(actual).toBe(expected);
  });
});

describe('cond', () => {
  test('should execute first `true` condition', () => {
    const evaluator = cond([
      [(v) => v === 'foo', () => 'foo'],
      [(v) => v === 'bar', () => 'bar'],
      [(v) => v === 'food bear', () => 'food bear'],
      [stubTrue, () => null],
    ]);

    const actual = evaluator('bar');
    const expected = 'bar';

    expect(actual).toBe(expected);
  });

  test('should handle bad parameters', () => {
    const evaluator = cond();

    const actual = evaluator('test');
    const expected = undefined;

    expect(actual).toEqual(expected);
  });
});

describe('flow', () => {
  test('should apply functions in order', () => {
    const add = (...args) => args.reduce((acc, v) => acc + v, 0);
    const square = (v) => v ** 2;

    const addSquare = flow([add, square]);

    const actual = addSquare(1, 2);
    const expected = 9;

    expect(actual).toEqual(expected);
  });
});

describe('queryString', () => {
  describe('parse', () => {
    test('should parse null', () => {
      const query = 'foo=bar&food=null';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', food: null };

      expect(actual).toEqual(expected);
    });

    test('should parse undefined', () => {
      const query = 'foo=bar&food=undefined';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', food: undefined };

      expect(actual).toEqual(expected);
    });

    test('should parse empty values as null', () => {
      const query = 'foo=bar&food=';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', food: null };

      expect(actual).toEqual(expected);
    });
  });
});
