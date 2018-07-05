// @flow
/* global ActionConfig, FluxStandardAction */

/**
 *
 * @param {*} config
 * @param {*} defaultState
 */
const combineSubReducers = (actionConfig: ActionConfig, initialState: any) => (prevState: ?Object, action: FluxStandardAction): any => {
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
 *
 * @param {*} prevState
 */
const returnPrevState = <T>(prevState: T): T => prevState;

module.exports = combineSubReducers;
module.exports.combineSubReducers = combineSubReducers;
module.exports.returnPrevState = returnPrevState;
