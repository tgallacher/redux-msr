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

    // eslint-disable-next-line
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

      expect(result).toBeArray();
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
    it('returns the inital state when prev state is undefined', () => {
      // We'll just use one state type
      const initState = { foobar: 3 };
      const reducerConfig = [
        prevState => prevState,
      ];

      const reducer = combineSubReducers(initState, reducerConfig);
      const result = reducer(undefined, { type: '@@test' });

      expect(result).toBeObject();
      expect(result).toStrictEqual(initState);
    });

    it('returns the prev state when the dispatched action type is not specified in reducer config', () => {
      const initState = 0;
      const reducerConfig = [
        (prevState, action) => {
          switch (action.type) {
          case 'NOT.THE.ONE': return 999;
          default: return prevState;
          }
        },
      ];

      const reducer = combineSubReducers(initState, reducerConfig);
      const result = reducer(initState, { type: 'SOME.ACTION.TYPE' });

      expect(result).toBeNumber();
      expect(result).toStrictEqual(initState);
    });

    it('returns the correct state when typeof initialState == number and a single reducer', () => {
      const initState = 0;
      const expectedResult = 999;
      const reducerConfig = [
        (prevState, action) => {
          switch (action.type) {
          case 'SOME.ACTION.TYPE': return expectedResult;
          default: return prevState;
          }
        },
      ];

      const reducer = combineSubReducers(initState, reducerConfig);
      const result = reducer(initState, { type: 'SOME.ACTION.TYPE' });

      expect(result).toBeNumber();
      expect(result).toStrictEqual(expectedResult);
    });

    it('returns the correct state when typeof initialState == object and a single reducer', () => {
      const initState = { foo: 0 };
      const expectedResult = { foo: 999 };
      const reducerConfig = [
        (prevState, action) => {
          switch (action.type) {
          case 'SOME.ACTION.TYPE': return expectedResult;
          default: return prevState;
          }
        },
      ];

      const reducer = combineSubReducers(initState, reducerConfig);
      const result = reducer(initState, { type: 'SOME.ACTION.TYPE' });

      expect(result).toBeObject();
      expect(result).toStrictEqual(expectedResult);
    });

    it('returns the correct state when the typeof initialState == array and a single reducer', () => {
      const initState = [1, 2, 3];
      const expectedResult = [4, 5, 6];
      const reducerConfig = [
        (prevState, action) => {
          switch (action.type) {
          case 'SOME.ACTION.TYPE': return expectedResult;
          default: return prevState;
          }
        },
      ];

      const reducer = combineSubReducers(initState, reducerConfig);
      const result = reducer(initState, { type: 'SOME.ACTION.TYPE' });

      expect(result).toBeArray();
      expect(result).toStrictEqual(expectedResult);
    });

    it('returns the new state when there are more than one applying reducer', () => {
      const initState = [1, 2, 3];
      const expectedResult = [4, 5, 6, 7, 8, 9];
      const reducerConfig = [
        (prevState, action) => {
          switch (action.type) {
          case 'SOME.ACTION.TYPE': return [4, 5, 6];
          default: return prevState;
          }
        },
        (prevState, action) => {
          switch (action.type) {
          case 'SOME.ACTION.TYPE': return prevState.concat([7, 8, 9]);
          default: return prevState;
          }
        },
      ];

      const reducer = combineSubReducers(initState, reducerConfig);
      const result = reducer(initState, { type: 'SOME.ACTION.TYPE' });

      expect(result).toBeArray();
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
