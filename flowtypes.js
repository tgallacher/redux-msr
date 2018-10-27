// @flow

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

declare type ReducerObjectConfig<S> = {
  [actionType: string]: S | Reducer<S, FluxStandardAction>,
  default?: S | Reducer<S, FluxStandardAction>,
};

declare type ReducerArrayConfig<S> = Reducer<S, FluxStandardAction>[];


/**
 * Config setup for allocating reducers.
 *
 * Keys correspond to the action type, and the value the
 * reducer/value that should be used when that given action
 * type is dispatched.
 *
 * @type {object}
 */
declare type ReducerConfig<S> =
  | ReducerObjectConfig<S>
  | ReducerObjectConfig<S>;
