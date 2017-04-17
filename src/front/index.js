// @flow
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {devToolsEnhancer} from 'redux-devtools-extension';
import * as Ship from 'redux-ship';
import * as ShipDevTools from 'redux-ship-devtools';
import * as Controller from './controller';
import * as Effect from './effect';
import * as Model from './model';
import Index from './view';

const store = createStore(Model.reduce, Model.initialState, devToolsEnhancer());

function dispatch(action: Controller.Action): void {
  const control = ShipDevTools.inspect(Controller.control);
  Ship.run(Effect.run, store, control(action));
}

function render() {
  ReactDOM.render(
    <Index
      dispatch={dispatch}
      state={store.getState()}
    />,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();
