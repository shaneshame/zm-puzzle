const noop = () => {};

const negate = (predicate) => {
  return (...args) => !predicate(...args);
};

const stubTrue = () => true;

const stubFalse = () => false;

const identity = (value) => value;

const isFunction = (value) => typeof value === 'function';

const isNull = (value) => value === null;

const isUndefined = (value) => {
  return typeof value === 'undefined';
};

const isString = (value) => {
  return typeof value === 'string';
};

const isNil = (value) => {
  return isUndefined(value) || isNull(value);
};

const isPresent = negate(isNil);

const isEmpty = (value) => {
  return isNil(value) || Object.entries(value).length === 0;
};

const isNumber = (value) => {
  return isString(value)
    ? !isEmpty(value) && !isNaN(Number(value))
    : typeof value === 'number';
};

const overEvery = (predicates = []) => {
  return (...args) => predicates.every((predicate) => predicate(...args));
};

const overSome = (predicates = []) => {
  return (...args) => predicates.some((predicate) => predicate(...args));
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
    const [, callback = noop] =
      conditionPairs.find(([predicate = noop]) => predicate(...args)) ?? [];

    return callback(...args);
  };
};

const isStringArray = (str = '') => str.includes(',');
const isStringNull = (str = '') => str === 'null';
const isStringUndefined = (str = '') => str === 'undefined';
const isStringTrue = (str = '') => str === 'true';
const isStringFalse = (str = '') => str === 'false';

const isStringPrimitive = overSome([
  isStringNull,
  isStringUndefined,
  isStringTrue,
  isStringFalse,
]);

const parseStringPrimitive = cond([
  [isStringNull, () => null],
  [isStringUndefined, () => undefined],
  [isStringTrue, stubTrue],
  [isStringFalse, stubFalse],
  [stubTrue, identity],
]);

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

const shouldInclude = overEvery([isPresent, negate(isEmpty)]);

const stringify = (obj = {}) => {
  const filteredEntries = Object.entries(obj).filter(([_, value]) =>
    shouldInclude(value),
  );

  const sortedEntries = filteredEntries.sort(alphaByKey);
  const searchParams = new URLSearchParams(sortedEntries);
  const searchParamsString = searchParams.toString();

  const decodedSearchParamsString = searchParamsString.replace(/%2C/g, ',');

  return decodedSearchParamsString;
};

const parseValue = cond([
  [isStringArray, parseStringArray],
  [isNumber, Number],
  [isStringPrimitive, parseStringPrimitive],
  [stubTrue, identity],
]);

const parse = (queryString) => {
  const searchParams = new URLSearchParams(queryString);

  return [...searchParams.entries()].reduce((acc, [key, value]) => {
    return shouldInclude(value)
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
  filterObject,
  flow,
  identity,
  isEmpty,
  isFunction,
  isNumber,
  isPresent,
  overEvery,
  queryString,
  updateUrlQuery,
};
