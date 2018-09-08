// @flow

/**
 * Main library entrypoint.
 * Combine several sub-reducers to construct a single resource
 * reducer. Each sub reducer will receive the same full Redux store
 * slice as the resulting main reducer.
 *
 * @param {any} initialState The initial state to return
 * @param {ActionConfig | Array<Function>} config Action type & reducer configuration object
 */
const mergeSubReducers = <T>(
  initialState: T,
  reducers: ReducerConfig,
) => (prevState: ?T, action: FluxStandardAction): T => {
  const _newState = reducer(prevState, action);

  if (reducers instanceof Array) {
    return reducers.reduce((newState, reducer) => {
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



    if ('default' in reducers) {
      return reducers.default || initialState;
    }
    if (! (action.type in reducers)) {
      return prevState || initialState;
    }

    return (typeof reducers[action.type] === 'function')
      ? reducers[action.type](prevState, action)
      : reducers[action.type];
  };

/**
 * Helper method to return the previous reducer state.
 * This should be used for action types where you would like
 * to simply return the previous state, such as the default action response.
 *
 * @param {T} prevState The previous reducer state
 */
const returnPrevState = <T>(prevState: T): T => prevState;

module.exports = mergeSubReducers;
module.exports.mergeSubReducers = mergeSubReducers;
module.exports.returnPrevState = returnPrevState;
