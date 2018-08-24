// @flow
/* eslint-disable */

/**
 * Flux Standard Action spec
 *
 * @type {object}
 */
declare type FluxStandardAction = {
  type: string,
  payload?: any,
  meta?: any
};

/**
 * Config setup for allocating reducers.
 *
 * Keys correspond to the action type, and the value the
 * reducer/value that should be used when that given action
 * type is dispatched.
 *
 * @type {object}
 */
declare type ReducerConfig = {
  [actionType: string]: any
};
