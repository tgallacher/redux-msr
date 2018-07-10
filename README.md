# Redux MSR (Merge Sub Reducers)

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

Merge sub-reducers while sharing the same Redux store (or slice), enabling scalable reducer code management and reuse.

## The Problem

How best to manage file sizes, reducer layout, code reuse, etc. as reducer complexity and/or size increases. Even when using Redux's [combineReducers()](https://redux.js.org/api-reference/combinereducers) API method to split and organise your (global) store, resource reducers can still grow and become difficult to maintain. This problem can also be further amplified when adopting the [ducks](https://github.com/erikras/ducks-modular-redux) practice.

## The Solution

> Assume an app which at some point includes counter-based functionality (detail omitted for brevity)

> Note: The below example is also using the ducks practice for organising action creators, constants and the root resource-reducer.

We can take the following extremely simplified example:

```js
const INCREMENT = 'COUNTER.INCREMENT.VALUE';
const DECREMENT = 'COUNTER.DECREMENT.VALUE';

const defaultState = 0;

export const incrementValue = () => ({
  type: INCREMENT
});

export const decrementValue = () => ({
  type: DECREMENT
});

export default (prevCounterState = defaultState, action) => {
  switch (action.type) {
    case INCREMENT:
      // ...
      // ... other complicated or lengthy code
      // ...
      return prevCounterState + 1;
      case DECREMENT:
      // ...
      // ... other complicated or lengthy code
      // ...
      return prevCounterState - 1;
    // other case(s)
    // .
    // .
    // .
    default:
      return prevCounterState;
  }
};
```

And extract/refactor into something like:

```js
const defaultState = 0;

import combineSubReducers from 'redux-msr';
import incrementReducer from './reducers/incrementReducers';
import decrementReducer from './reducers/decrementReducers';

const INCREMENT = 'COUNTER.INCREMENT.VALUE';
const DECREMENT = 'COUNTER.DECREMENT.VALUE';

export const incrementValue = () => ({
  type: INCREMENT
});

export const decrementValue = () => ({
  type: DECREMENT
});

export default combineSubReducers(defaultState, {
  [INCREMENT]: incrementReducer,
  [DECREMENT]: decrementReducer
});
```

## Table of Contents

<!-- TOC -->

- [Redux MSR (Merge Sub Reducers)](#redux-msr-merge-sub-reducers)
  - [The Problem](#the-problem)
  - [The Solution](#the-solution)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)

<!-- /TOC -->

## Installation

This module is distributed via [npm]() and should be included as part of your package's dependencies:

```shell
npm install --save redux-msr
```

## Usage

The main method exported by this module has the following type signature:

`combineSubReducers(defaultState: any, reducerConfig: object) => ReducerFn`

where,

* `defaultState` - The default state to use when the Redux store is initialised
* `reducerConfig` - An object whose key-value pairs correspond to the action type and corresponding value to return for that action type, respectively. If the return value is a function, then this will be called with the standard Redux reducer parameters, namely `<T>(previousState: T, action: object) => T`.

The reducer returned by this module will return the previous state unless a specific action type is noted, and a subsequent value or function is supplied in order to change what the new (immutable) state should be. If you need to overwrite the `default` response of the resulting reducer, i.e. if no action-types match the currently dispatched action, then simply add the required value/function to the `default` key within the `reducerConfig` object. For example,

```js
export default combineSubReducers(defaultState, {
  default: myDefaultReducer
});
```

## Examples

Return basic primitive types for a given action type:

```js
// reducer.js
// State is a Number
import combineSubReducers from 'redux-msr';

const defaultState = 0;

export default combinSubReducers(defaultState, {
  'EXAMPLE.ACTION.TYPE.1': 4,
  'EXAMPLE.ACTION.TYPE.2': 20,
});
```

```js
// reducer.js
// State is a String
import combineSubReducers from 'redux-msr';

const defaultState = '';

export default combinSubReducers(defaultState, {
  'EXAMPLE.ACTION.TYPE.1': 'monday',
  'EXAMPLE.ACTION.TYPE.2': 'tuesday',
});
```

Use a refactored sub-reducer:

```js
// reducer.js
// State is a Number
import combineSubReducers from 'redux-msr';

const defaultState = 0;

export default combinSubReducers(defaultState, {
  'EXAMPLE.ACTION.TYPE.1': handleType1Reducer,
  'EXAMPLE.ACTION.TYPE.2': handleType2Reducer,
});
```

Where `handleType1Reducer` and `handleType2Reducer` have the form:

```js
// reducers/handleType1Reducer.js, or
// reducers/handleType2Reducer.js
export default (prevState, action) => {
  // single action type reducer code
};
```
