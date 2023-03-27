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

const isNumber = (v) => {
  return !isNaN(Number(v));
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

const ensureLeadingQuestion = (str = '') => {
  return str[0] === '?' ? str : `?${str}`;
};

const wrapArrayBrackets = (str = '') => {
  return `[${str}]`;
};

const parseArrayString = (arrayString = '') => {
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

const stringify = (obj = {}) => {
  const entries = Object.entries(obj).filter(([_, value]) => {
    return isPresent(value);
  });

  const searchParams = new URLSearchParams(entries);

  const searchParamsString = searchParams.toString();

  const decodedSearchParamsString = searchParamsString.replace(/%2C/g, ',');

  return decodedSearchParamsString;
};

const parseValue = cond([
  [isStringArray, parseArrayString],
  [isNumber, Number],
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

export { cond, flow, identity, isFunction, queryString, updateUrlQuery };
