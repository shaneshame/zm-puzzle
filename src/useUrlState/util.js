const stubTrue = () => true;

const identity = (value) => value;

const isFunction = (value) => typeof value === 'function';

const isNull = (value) => value === null;

const isUndefined = (value) => {
  return typeof value === 'undefined';
};

const isNil = (value) => {
  return isUndefined(value) || isNull(value);
};

const isPresent = (value) => {
  return !isNil(value);
};

const isEmpty = (value) => {
  return !isPresent(value) || Object.entries(value).length === 0;
};

const isNumber = (value = '') => {
  return !isEmpty(value) && !isNaN(Number(value));
};

const filterObject = (obj = {}, predicate = identity) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return predicate(value, key)
      ? {
          ...acc,
          [key]: value,
        }
      : acc;
  }, {});
};

const flow = (funcs = []) => {
  return (...args) => {
    return funcs.reduce(
      (accumulator, nextFunc) =>
        isUndefined(accumulator) ? nextFunc(...args) : nextFunc(accumulator),
      undefined,
    );
  };
};

const cond = (conditionPairs = []) => {
  return (...args) => {
    for (const [predicate, execution] of conditionPairs) {
      if (predicate(...args)) {
        return execution(...args);
      }
    }

    return;
  };
};

const isStringArray = (str = '') => str.includes(',');
const isStringNull = (str = '') => str === 'null';
const isStringUndefined = (str = '') => str === 'undefined';

const ensureLeadingQuestion = (str = '') => {
  return str[0] === '?' ? str : `?${str}`;
};

const wrapArrayBrackets = (str = '') => {
  return `[${str}]`;
};

const parseStringArray = (arrayString = '') => {
  return JSON.parse(wrapArrayBrackets(arrayString));
};

const updateUrlQuery = (urlString = '', query) => {
  const baseUrl = new URL(urlString);
  const search = query ? `${ensureLeadingQuestion(query)}` : '';

  const newUrlString = `${baseUrl.origin}${baseUrl.pathname}${search}${baseUrl.hash}`;

  return newUrlString;
};

// `stringify` and `parse` inspired by Rob Marshall
// https://robertmarshall.dev/blog/migrating-from-query-string-to-urlsearchparams/

const alphaByKey = ([keyA], [keyB]) => keyA.localeCompare(keyB);

const stringify = (obj = {}) => {
  const entries = Object.entries(obj).filter(([_, value]) => isPresent(value));
  const sortedEntries = entries.sort(alphaByKey);
  const searchParams = new URLSearchParams(sortedEntries);
  const searchParamsString = searchParams.toString();

  const decodedSearchParamsString = searchParamsString.replace(/%2C/g, ',');

  return decodedSearchParamsString;
};

const parseValue = cond([
  [isStringArray, parseStringArray],
  [isNumber, Number],
  [isStringNull, () => null],
  [isStringUndefined, () => undefined],
  [isEmpty, () => null],
  [stubTrue, identity],
]);

const parse = (queryString) => {
  const searchParams = new URLSearchParams(queryString);

  return [...searchParams.entries()].reduce((acc, [key, value]) => {
    return isPresent(value)
      ? {
          ...acc,
          [key]: parseValue(value),
        }
      : acc;
  }, {});
};

const queryString = { parse, stringify };

export {
  cond,
  flow,
  filterObject,
  identity,
  isEmpty,
  isFunction,
  isPresent,
  queryString,
  updateUrlQuery,
};
