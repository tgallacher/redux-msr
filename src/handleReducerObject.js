// @flow

// eslint-disable-next-line
const handleReducerObject = <T>(
  initialState: T,
  reducerConfig: ReducerObjectConfig<T>,
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

export default handleReducerObject;
