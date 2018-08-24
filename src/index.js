// @flow

/**
 * Main library entrypoint.
 * Combine several sub-reducers to construct a single resource
 * reducer. Each sub reducer will receive the same full Redux store
 * slice as the resulting main reducer.
 *
 * @param {any} initialState The initial state to return
 * @param {ActionConfig} config Action type & reducer configuration object
 */
const mergeSubReducers = <T>(
  initialState: T,
  actionConfig: ActionConfig,
) => (prevState: ?T, action: FluxStandardAction): T => {
    if ('default' in actionConfig) {
      return actionConfig.default || initialState;
    }
    if (! (action.type in actionConfig)) {
      return prevState || initialState;
    }

    return (typeof actionConfig[action.type] === 'function')
      ? actionConfig[action.type](prevState, action)
      : actionConfig[action.type];
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
