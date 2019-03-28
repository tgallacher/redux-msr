# Redux MSR

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg?style=flat-square&logo=Github)](http://makeapullrequest.com) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/tgallacher/redux-msr/graphs/commit-activity) ![NPM version](https://img.shields.io/npm/v/redux-msr.svg?style=flat) [![install size](https://packagephobia.now.sh/badge?p=redux-msr@0.2.0)](https://packagephobia.now.sh/result?p=redux-msr@0.2.0) ![Minified size](https://img.shields.io/bundlephobia/min/redux-msr.svg?style=flat) ![NPM license](https://img.shields.io/npm/l/redux-msr.svg?style=flat) [![Build Status](https://travis-ci.com/tgallacher/redux-msr.svg?branch=master)](https://travis-ci.com/tgallacher/redux-msr)
[![Coverage Status](https://coveralls.io/repos/github/tgallacher/redux-msr/badge.svg?branch=master)](https://coveralls.io/github/tgallacher/redux-msr?branch=master)

Merge sub-reducers (MSR) while sharing the same Redux store (or sub-state component), enabling scalable reducer code management and reuse.

**Table of Contents**

<!-- TOC depthFrom:2 depthTo:2 -->

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Installation](#installation)
- [API](#api)
- [Examples](#examples)

<!-- /TOC -->

## The Problem

Redux's API provides [combineReducers()](https://redux.js.org/api-reference/combinereducers) to help manage and split large or complicated store state into smaller chunks that can then be better split/organised within a project. However, even parts of these broken states -- or non-split stores -- handle multiple action types, and/or can include relatively long/complex reducer logic. Code management or readability can quickly become difficult, and we often have to split our reducers into smaller reducers, but then end up with unnecessary code to load or organise such reducers.

This package aims to help provide a simple API to join and reuse reducers, so that code manageement and complexity become easier to manage and scale.


## The Solution

> Note: The below example is using [ducks](https://github.com/erikras/ducks-modular-redux) for organising action creators, constants and the root resource-reducer.

Taking the following simplified example:

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

With `redux-msr`, this can be simplified to:

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

## Installation

This module is distributed via [npm](https://www.npmjs.com) and should be included as part of your package's dependencies:

```shell
npm install --save redux-msr
```

## API

### `combineSubReducers<T>(defaultState: T, reducerConfig: ReducerConfig) => Reducer<T>`

**defaultState**

The default state to use when the Redux store is initialised

**reducerConfig**

This can either be an `Array` or an `Object`.

When an `Array`, the array should be an array of Redux reducer functions (type: [Reducer](https://github.com/reduxjs/redux/blob/master/index.d.ts)). Each reducer in the array will be triggered for all `action.type`'s and will be each passed the previous state in sequential order. The result returned by each reducer will be passed to the subsequent in the array, with the final state returned by the array being passed back to the Redux store.

When an `Object`, the object key-value pairs should correspond to the action type and corresponding value to return for that action type, respectively. If the return value is a function, then this will be called with the standard Redux reducer parameters, namely `Reducer` ([see Redux typing](https://github.com/reduxjs/redux/blob/master/index.d.ts)).

The reducer returned by this module will return the previous state unless a specific action type is noted, and a subsequent value or function is supplied in order to change what the new (immutable) state should be. If you need to overwrite the `default` response of the resulting reducer, i.e. if no action-types match the currently dispatched action, then simply add the required value/function to the `default` key within the `reducerConfig` object. For example,

```js
export default combineSubReducers(defaultState, {
  default: myDefaultReducer
});
```

### `returnPrevState<T>(prevState: T) => T`

A simply utility that can be used to force a simple *short circuit* and return the previous state. This can be particularly useful when the `reducerConfig`  is the `Object` variant, and for a given `action.type` you would like to return the previous state, e.g. during a dispatched error.


## Examples

These are just a small set of examples of what is possible. This package can be used on its own for a single Redux store, or one that has been subdivided into smaller store *slices* using Redux's [combineReducers()](https://redux.js.org/api-reference/combinereducers) API, as mentioned above.

### reducerConfig: Object type
#### 1. Return basic primitive types for a given action type:

```js
// reducer.js
import combineSubReducers from 'redux-msr';

// State is a Number
const defaultState = 0;

export default combinSubReducers(defaultState, {
  'EXAMPLE.ACTION.TYPE.1': 4,
  'EXAMPLE.ACTION.TYPE.2': 20,
});
```

```js
// reducer.js
import combineSubReducers from 'redux-msr';

// State is a String
const defaultState = '';

export default combinSubReducers(defaultState, {
  'EXAMPLE.ACTION.TYPE.1': 'foo',
  'EXAMPLE.ACTION.TYPE.2': 'bar',
});
```

#### 2. Use sub-reducer(s):

```js
// reducer.js
import combineSubReducers from 'redux-msr';

import handleType1Reducer from './reducers/reducer1';
import handleType2Reducer from './reducers/reducer2';

// State is a Number
const defaultState = 0;

export default combinSubReducers(defaultState, {
  'EXAMPLE.ACTION.TYPE.1': handleType1Reducer,
  'EXAMPLE.ACTION.TYPE.2': handleType2Reducer,
});
```

Here, both `handleType1Reducer` and `handleType2Reducer` have the `Reducer` type signature (see [here](https://github.com/reduxjs/redux/blob/master/index.d.ts)).

#### 3. A combination

```js
// reducer.js
import combineSubReducers from 'redux-msr';

import handleType1Reducer from './reducers/reducer1';
import handleType2Reducer from './reducers/reducer2';

// State is a Number
const defaultState = 0;

export default combinSubReducers(defaultState, {
  'EXAMPLE.ACTION.TYPE.1': handleType1Reducer,
  'EXAMPLE.ACTION.TYPE.2': handleType2Reducer,
  'EXAMPLE.ACTION.TYPE.3': 10,
});
```

### reducerConfig: Array type

```js
// reducer.js
import combineSubReducers from 'redux-msr';

import reducerA from '/some/other/part/of/codebase';

// Assume our state is a simple number
const defaultState = 0;

// Mocked reducer
const reducerB = (prevState: number = defaultState, action: Action) => {
  switch(action.type){
    case 'foo':
      return 100;

    default: return prevState;
  }
};

/**
 * Remember: the order of the reducers in the array matter!
 *
 * State is passed to the first reducer, here `reducerA`; the state returned
 * from reducerA is then passed to `reducerB`; the state returned from reducerB
 * is then sent back to the Redux store.
 */
const mainReducer = comineSubReducers(defaultState, [
  reducerA,
  reducerB,
]);

export default mainReducer;
```
