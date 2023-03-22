import { updateUrlQuery } from './util';

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
    let oddUrl = 'https://subdomain.domain.com/url=?https://example.com';

    let newQuery = 'https://google.com';

    let actual = updateUrlQuery(oddUrl, newQuery);
    let expected = 'https://subdomain.domain.com/url=?https://google.com';

    expect(actual).toBe(expected);
  });
});
