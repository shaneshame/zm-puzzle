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

const ensureArray = (value) => {
  return Array.isArray(value) ? value : [value];
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

const stringPrimitivePairs = [
  [isNumber, Number],
  [isStringNull, () => null],
  [isStringUndefined, () => undefined],
  [isStringTrue, stubTrue],
  [isStringFalse, stubFalse],
];

const isStringPrimitive = overSome(
  stringPrimitivePairs.map(([predicate]) => predicate),
);

const parseStringPrimitive = cond([
  ...stringPrimitivePairs,
  [stubTrue, identity],
]);

const parseStringArray = (arrayString = '') => {
  return arrayString.split(',').map(parseStringPrimitive);
};

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
  [isStringPrimitive, parseStringPrimitive],
  [stubTrue, identity],
]);

const parse = (queryString) => {
  const searchParams = new URLSearchParams(queryString);

  return [...searchParams.entries()].reduce((acc, [key, value]) => {
    if (shouldInclude(value)) {
      const parsedValue = parseValue(value);

      const newValue = acc[key]
        ? ensureArray(acc[key]).concat(ensureArray(parsedValue))
        : parsedValue;

      return {
        ...acc,
        [key]: newValue,
      };
    }

    return acc;
  }, {});
};

const queryString = { parse, stringify };

const ensureLeadingQuestion = (str = '') => {
  return str[0] === '?' ? str : `?${str}`;
};

function getQueryNavigation(locationString, newQuery) {
  if (!locationString) return '';

  const baseUrl = new URL(locationString);
  const query = newQuery ? `${ensureLeadingQuestion(newQuery)}` : '';

  return `${baseUrl.pathname}${query}${baseUrl.hash}`;
}

function isBrowser() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

export {
  cond,
  getQueryNavigation,
  identity,
  isBrowser,
  isEmpty,
  isFunction,
  isNumber,
  isPresent,
  overEvery,
  overSome,
  queryString,
};
