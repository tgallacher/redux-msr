// @flow

/**
 *
 * @param initialState
 * @param reducerConfig
 * @param prevState
 * @param action
 */
const handleReducerArray = <T>(
  initialState: T,
  reducerConfig: ReducerArrayConfig<T>,
  prevState: ?T,
  action: FluxStandardAction,
): T => reducerConfig.reduce(
    (newState, reducer) => reducer(newState, action),
    prevState || initialState,
  );

export default handleReducerArray;
