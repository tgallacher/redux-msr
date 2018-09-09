import combineSubReducers from '../src/index';

describe('Reducer config is', () => {
  describe('an object type', () => {
    it('returns the inital state when prev state is undefined', () => {
      const initState = { foobar: 3 };
      const actionConfig = {};

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(undefined, { type: '@@test' });

      expect(result).toBeObject();
      expect(result).toStrictEqual(initState);
    });

    it('supports a "default" action type which returns the provided value when no other action types are matched for the given dispatched action', () => {
      const initState = { foobar: 3 };
      const actionConfig = {
        default: { foobar: 10 },
      };

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(initState, { type: '@@test' });

      expect(result).toBeObject();
      expect(result).toStrictEqual(actionConfig.default);
    });

    it('returns the prev state when the dispatched action type is not specified in reducer config', () => {
      const initState = { foobar: 3 };
      const prevState = { foobar: 22 };
      const actionConfig = {};

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(prevState, { type: '@@test' }); // dispatch an action which is not expected

      expect(result).toBeObject();
      expect(result).toStrictEqual(prevState);
    });

    it('returns non callable reducer type values as-is', () => {
      const initState = { foobar: 3 };
      const actionType = 'example.action';
      const actionConfig = {
        [actionType]: [1, 2],
      };

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(initState, { type: actionType });

      expect(result).toBeObject();
      expect(result).toStrictEqual(actionConfig[actionType]);
    });

    it('calls the supplied reducer with the correct arguments', () => {
      const actionType = 'example.action';
      const initState = { foobar: 3 };
      const action = { type: actionType };
      const subReducer = jest.fn();

      const actionConfig = {
        [actionType]: subReducer,
      };

      const reducer = combineSubReducers(initState, actionConfig);

      reducer(initState, action);

      expect(subReducer).toHaveBeenCalledTimes(1);
      expect(subReducer).toHaveBeenCalledWith(initState, action);
    });

    it('returns the correct state when typeof the initial state is a number', () => {
      const initState = 0;
      const actionType = 'example.action';
      const subReducer = prevState => prevState + 10;

      const actionConfig = {
        [actionType]: subReducer,
      };

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(initState, { type: actionType });

      expect(result).toBeNumber();
      expect(result).toStrictEqual(10);
    });

    it('returns the correct state when typeof the initial state is an object', () => {
      const initState = { foo: 100 };
      const newState = { foo: 200 };
      const actionType = 'example.action';
      const subReducer = () => newState;

      const actionConfig = {
        [actionType]: subReducer,
      };

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(initState, { type: actionType });

      expect(result).toBeObject();
      expect(result).toStrictEqual(newState);
    });

    it('returns the correct state when the typeof the initial state is an array', () => {
      const initState = [];
      const newState = [1, 4, 5];
      const actionType = 'example.action';
      const subReducer = () => newState;

      const actionConfig = {
        [actionType]: subReducer,
      };

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(initState, { type: actionType });

      expect(result).toBeArray();
      expect(result).toStrictEqual(newState);
    });

    it('doesn\'t mutate state when an unrecognised type is dispatched', () => {
      const initState = [1, 4, 5];
      const actionType = 'example.action';
      const subReducer = () => [10, 20, 30];

      const actionConfig = {
        [actionType]: subReducer,
      };

      const reducer = combineSubReducers(initState, actionConfig);
      const result = reducer(initState, { type: '@@NOPE' });

      expect(result).toBeArray();
      expect(result).toStrictEqual(initState);
    });
  });

  describe('an array type', () => {
    it.skip('returns the inital state when prev state is undefined', () => {});
    it.skip('returns the prev state when the dispatched action type is not specified in reducer config', () => {});
    it.skip('returns the correct state when typeof the initial state is a number', () => {});
    it.skip('returns the correct state when typeof the initial state is an object', () => {});
    it.skip('returns the correct state when the typeof the initial state is an array', () => {});
  });
});

describe('returns the correct merged state when given a list of reducers', () => {
  const fooReducer = (prevState, action) => {
    const { payload: { foo } = {} } = action;

    switch (action.type) {
    case mockAction.type:
      return {
        ...prevState,
        foo: foo || prevState.foo,
      };

    default:
      return prevState;
    }
  };

  const barReducer = (prevState, action) => {
    const { payload: { bar } = {} } = action;

    switch (action.type) {
    case mockAction.type:
      return {
        ...prevState,
        bar: bar || prevState.bar,
      };

    default:
      return prevState;
    }
  };

  it('and a single reducer is triggered', () => {
    const initState = { foo: 1, bar: 'baz' };
    const mockAction = { type: 'test.action', payload: { foo: 4 } };
    const expectedState = { foo: 4, bar: 'baz' };

    const reducer = combineSubReducers(initState, [
      fooReducer,
      barReducer,
    ]);

    const newState = reducer(initState, mockAction);

    expect(newState).toBeObject();
    expect(newState).toStrictEqual(expectedState);
  });

  it('and multiple reducers are triggered', () => {
    const initState = { foo: 1, bar: 'baz' };
    const mockAction = { type: 'test.action', payload: { foo: 10, baz: 'world' } };
    const expectedState = { foo: 10, bar: 'world' };

    const reducer = combineSubReducers(initState, [
      fooReducer,
      barReducer,
    ]);

    const newState = reducer(initState, mockAction);

    expect(newState).toBeObject();
    expect(newState).toStrictEqual(expectedState);
  });
});
