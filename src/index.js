// @flow

// eslint-disable-next-line
const handleReducerArray = <T>(
  initialState: T,
  reducerConfig: Reducer[],
  prevState: ?T,
  action: FluxStandardAction,
): T => {
  return reducerConfig.reduce((newState, reducer) => {
    switch (typeof newState) {
    case 'array':
      return newState.concat();
    case 'object':
      return Object.assign({}, newState, reducer(prevState, action));


    default:
      return newState;
    }
  }, prevState);
}

// eslint-disable-next-line
const handleReducerObject = <T>(
  initialState: T,
  reducerConfig: ReducerConfig,
  prevState: ?T,
  action: FluxStandardAction,
): T => {
  if ('default' in reducerConfig) {
    return reducerConfig.default || initialState;
  }
  if (! (action.type in reducerConfig)) {
    return prevState || initialState;
  }

  return (typeof reducerConfig[action.type] === 'function')
    ? reducerConfig[action.type](prevState, action)
    : reducerConfig[action.type];
};

/**
 * Main library entrypoint.
 * Combine several sub-reducers to construct a single resource
 * reducer. Each sub reducer will receive the same full Redux store
 * slice as the resulting main reducer.
 *
 * @param {any} initialState The initial state to return
 * @param {ReducerConfig} reducerConfig Action type & reducer configuration object
 */
export const mergeSubReducers = <T>(initialState: T, reducerConfig: ReducerConfig) =>
  (prevState: ?T, action: FluxStandardAction): T => { // eslint-disable-line
    return Array.isArray(reducerConfig)
      ? handleReducerArray(initialState, reducerConfig, prevState, action)
      : handleReducerObject(initialState, reducerConfig, prevState, action);
  };

/**
 * Helper method to return the previous reducer state.
 * This should be used for action types where you would like
 * to simply return the previous state, such as the default action response.
 *
 * @param {T} prevState The previous reducer state
 */
export const returnPrevState = <T>(prevState: T): T => prevState;

export default mergeSubReducers;
