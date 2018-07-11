// @flow
/** @todo Fix linting with SemiStandardJS as it should pull Flowtypes in automatically... */
/* global ActionConfig, FluxStandardAction */

/**
 * Main library entrypoint.
 * Combine several sub-reducers to construct a single resource
 * reducer. Each sub reducer will receive the same full Redux store
 * slice as the resulting main reducer. This is unlike the behaviour and
 * intention of Redux's `combineReducers` API method.
 *
 * @param {any} initialState The initial state to return
 * @param {ActionConfig} config Action type & reducer configuration object
 */
const mergeSubReducers = (initialState: any, actionConfig: ActionConfig) => (prevState: ?Object, action: FluxStandardAction): any => {
  if ('default' in actionConfig) {
    return actionConfig['default'] || initialState;
  } else if (!(action.type in actionConfig)) {
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
