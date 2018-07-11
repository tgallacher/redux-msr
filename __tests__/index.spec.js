/* global test, expect, jest */
const combineSubReducers = require('../index');

test('returns the inital state when prev state is undefined', () => {
  const initState = { foobar: 3 };
  const actionConfig = {};

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(undefined, { type: '@@test' });

  expect(result).toBeObject();
  expect(result).toStrictEqual(initState);
});

test('returns given value as default action type when specified in action config', () => {
  const initState = { foobar: 3 };
  const actionConfig = {
    default: { foobar: 10 }
  };

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(initState, { type: '@@test' });

  expect(result).toBeObject();
  expect(result).toStrictEqual(actionConfig.default);
});

test('returns prev state as default action type when not specified in action config', () => {
  const initState = { foobar: 3 };
  const prevState = { foobar: 22 };
  const actionConfig = {};

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(prevState, { type: '@@test' });

  expect(result).toBeObject();
  expect(result).toStrictEqual(prevState);
});

test('returns non function types as-is', () => {
  const initState = { foobar: 3 };
  const actionType = 'example.action';
  const actionConfig = {
    [actionType]: [1, 2]
  };

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(initState, { type: actionType });

  expect(result).toBeObject();
  expect(result).toStrictEqual(actionConfig[actionType]);
});

test('calls supplied reducer with the correct arguments', () => {
  const actionType = 'example.action';
  const initState = { foobar: 3 };
  const action = { type: actionType };
  const subReducer = jest.fn();

  const actionConfig = {
    [actionType]: subReducer
  };

  const reducer = combineSubReducers(initState, actionConfig);
  reducer(initState, action);

  expect(subReducer).toHaveBeenCalledTimes(1);
  expect(subReducer).toHaveBeenCalledWith(initState, action);
});

test('returns the correct state when type is a number', () => {
  const initState = 0;
  const actionType = 'example.action';
  const subReducer = (prevState) => prevState + 10;

  const actionConfig = {
    [actionType]: subReducer
  };

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(initState, { type: actionType });

  expect(result).toBeNumber();
  expect(result).toStrictEqual(10);
});

test('returns the correct state when type is an object', () => {
  const initState = { foo: 100 };
  const newState = { foo: 200 };
  const actionType = 'example.action';
  const subReducer = () => newState;

  const actionConfig = {
    [actionType]: subReducer
  };

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(initState, { type: actionType });

  expect(result).toBeObject();
  expect(result).toStrictEqual(newState);
});

test('returns the correct state when type is an array', () => {
  const initState = [];
  const newState = [1, 4, 5];
  const actionType = 'example.action';
  const subReducer = () => newState;

  const actionConfig = {
    [actionType]: subReducer
  };

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(initState, { type: actionType });

  expect(result).toBeArray();
  expect(result).toStrictEqual(newState);
});

test('doesn\'t mutate state when an unrecognised type is dispatched', () => {
  const initState = [1, 4, 5];
  const actionType = 'example.action';
  const subReducer = () => [10, 20, 30];

  const actionConfig = {
    [actionType]: subReducer
  };

  const reducer = combineSubReducers(initState, actionConfig);
  const result = reducer(initState, { type: '@@NOPE' });

  expect(result).toBeArray();
  expect(result).toStrictEqual(initState);
});
