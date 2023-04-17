import {
  cond,
  getQueryNavigation,
  isEmpty,
  isNumber,
  overEvery,
  overSome,
  queryString,
  stubTrue,
} from './util';

describe('queryString', () => {
  describe('parse', () => {
    test('should parse `null`', () => {
      const query = 'foo=bar&food=null';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', food: null };

      expect(actual).toEqual(expected);
    });

    test('should parse `undefined`', () => {
      const query = 'foo=bar&food=undefined';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', food: undefined };

      expect(actual).toEqual(expected);
    });

    test('should parse `true`', () => {
      const query = 'foo=bar&food=true';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', food: true };

      expect(actual).toEqual(expected);
    });

    test('should parse `false`', () => {
      const query = 'foo=bar&food=false';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', food: false };

      expect(actual).toEqual(expected);
    });

    test('should filter empty values', () => {
      const query = 'foo=bar&food&cat=dog';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar', cat: 'dog' };

      expect(actual).toEqual(expected);
    });

    test('should filter empty values after equals', () => {
      const query = 'foo=bar&food=';

      const actual = queryString.parse(query);
      const expected = { foo: 'bar' };

      expect(actual).toEqual(expected);
    });

    test('should parse arrays as repeated keys', () => {
      const query = 'foo=bar&foo=tiger&foo=apple';

      const actual = queryString.parse(query);
      const expected = { foo: ['bar', 'tiger', 'apple'] };

      expect(actual).toEqual(expected);
    });

    test('should merge parsed arrays as repeated keys', () => {
      let query = 'foo=bar&foo=tiger&foo=apple,orange';

      let actual = queryString.parse(query);
      let expected = { foo: ['bar', 'tiger', 'apple', 'orange'] };

      query = 'foo=apple,orange&foo=bar&foo=tiger';

      actual = queryString.parse(query);
      expected = { foo: ['apple', 'orange', 'bar', 'tiger'] };

      expect(actual).toEqual(expected);
    });

    test('should parse array values', () => {
      const query = 'foo=bar&foo=3&foo=4,true,null,undefined&foo=false&foo=100';

      const actual = queryString.parse(query);
      const expected = {
        foo: ['bar', 3, 4, true, null, undefined, false, 100],
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('stringify', () => {
    test('should retain array syntax', () => {
      const data = { foo: 'bar', cat: [1, 2, 3] };

      const actual = queryString.stringify(data);
      const expected = 'cat=1,2,3&foo=bar';

      expect(actual).toBe(expected);
    });

    test('should filter empty values', () => {
      const data = {
        foo: '',
        bar: [],
        food: 'bear',
      };

      const actual = queryString.stringify(data);
      const expected = 'food=bear';

      expect(actual).toBe(expected);
    });

    test('should filter nil values', () => {
      const data = {
        foo: null,
        bar: undefined,
        food: 'bear',
      };

      const actual = queryString.stringify(data);
      const expected = 'food=bear';

      expect(actual).toBe(expected);
    });

    test('should serialize strings with spaces', () => {
      const data = {
        foo: 'bar food bear',
      };

      const actual = queryString.stringify(data);
      const expected = 'foo=bar+food+bear';

      expect(actual).toBe(expected);
    });
  });
});

describe('getQueryNavigation', () => {
  test('should not change with no query', () => {
    const baseUrl = 'https://en.wikipedia.org/wiki/Rickrolling';

    const actual = getQueryNavigation(baseUrl);
    const expected = '/wiki/Rickrolling';

    expect(actual).toBe(expected);
  });

  test('should update query', () => {
    const baseUrl =
      'https://en.wikipedia.org/w/index.php?title=Rickrolling&action=edit';

    const newQuery = 'title=RickRollRickRoll&data=1,2,3,4,5';

    const actual = getQueryNavigation(baseUrl, newQuery);
    const expected = '/w/index.php?title=RickRollRickRoll&data=1,2,3,4,5';

    expect(actual).toBe(expected);
  });

  test('should retain hash', () => {
    const baseUrl =
      'https://en.wikipedia.org/wiki/Rickrolling?title=Rickrolling#Later_usage';

    const newQuery = 'title=RickRollRickRoll&data=1,2,3,4,5';

    const actual = getQueryNavigation(baseUrl, newQuery);
    const expected =
      '/wiki/Rickrolling?title=RickRollRickRoll&data=1,2,3,4,5#Later_usage';

    expect(actual).toBe(expected);
  });

  test('should handle non-typical URLs', () => {
    const oddUrl = 'https://subdomain.domain.com/url=?https://example.com';

    const newQuery = 'https://google.com';

    const actual = getQueryNavigation(oddUrl, newQuery);
    const expected = '/url=?https://google.com';

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

describe('isEmpty', () => {
  test('should handle strings', () => {
    const actual = isEmpty('');
    const expected = true;

    expect(actual).toBe(expected);
  });
});

describe('isNumber', () => {
  test('should handle numbers', () => {
    const actual = isNumber(3);
    const expected = true;

    expect(actual).toBe(expected);
  });

  test('should handle numerical string', () => {
    const actual = isNumber('3');
    const expected = true;

    expect(actual).toBe(expected);
  });

  test('should reject non-numerical strings', () => {
    let actual = isNumber('');
    let expected = false;

    expect(actual).toBe(expected);

    actual = isNumber('test');
    expected = false;

    expect(actual).toBe(expected);
  });

  test('should reject arrays', () => {
    let actual = isNumber([]);
    let expected = false;

    expect(actual).toBe(expected);

    actual = isNumber([1, 2, 3]);
    expected = false;

    expect(actual).toBe(expected);
  });

  test('should reject objects', () => {
    let actual = isNumber({});
    let expected = false;

    expect(actual).toBe(expected);

    actual = isNumber({ foo: 'bar' });
    expected = false;

    expect(actual).toBe(expected);
  });

  test('should reject null', () => {
    const actual = isNumber(null);
    const expected = false;

    expect(actual).toBe(expected);
  });

  test('should reject undefined', () => {
    const actual = isNumber(undefined);
    const expected = false;

    expect(actual).toBe(expected);
  });
});

describe('overEvery', () => {
  test('should compose predicates', () => {
    const isEven = (v) => v % 2 === 0;
    const isGreaterThan10 = (v) => v > 10;

    const func = overEvery([isEven, isGreaterThan10]);

    let actual = func(12);
    let expected = true;

    expect(actual).toBe(expected);

    actual = func(10);
    expected = false;

    expect(actual).toBe(expected);

    actual = func(13);
    expected = false;

    expect(actual).toBe(expected);
  });
});

describe('overSome', () => {
  test('should compose predicates', () => {
    const isEven = (v) => v % 2 === 0;
    const isGreaterThan10 = (v) => v > 10;

    const func = overSome([isEven, isGreaterThan10]);

    let actual = func(11);
    let expected = true;

    expect(actual).toBe(expected);

    actual = func(8);
    expected = true;

    expect(actual).toBe(expected);

    actual = func(7);
    expected = false;

    expect(actual).toBe(expected);
  });
});
