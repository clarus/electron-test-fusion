// @flow
import 'babel-polyfill';
import {applyMiddleware, createStore} from 'redux';
import {devToolsEnhancer} from 'redux-devtools-extension';
import * as Ship from 'redux-ship';
import * as ShipDevTools from 'redux-ship-devtools';
import * as Controller from './controller';
import * as Effect from './effect';
import * as Run from './run';
import * as Model from './model';

const store = createStore(Model.reduce, Model.initialState, devToolsEnhancer());

function dispatch(action: Controller.Action): void {
  const control = ShipDevTools.inspect(Controller.control);
  Ship.run(Run.run, store, control(action));
}

Run.mount(dispatch, store);
