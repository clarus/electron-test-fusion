// @flow
import 'babel-polyfill';
import {applyMiddleware, createStore} from 'redux';
import {devToolsEnhancer} from 'redux-devtools-extension';
import * as Ship from 'redux-ship';
import * as ShipDevTools from 'redux-ship-devtools';
import * as AuthController from './auth/controller';
import * as AuthEffect from './auth/effect';
import * as AuthRun from './auth/run';
import * as FrontController from './front/controller';
import * as FrontEffect from './front/effect';
import * as FrontModel from './front/model';
import * as FrontRun from './front/run';

type Effect = {
  type: 'Auth',
  effect: AuthEffect.Effect,
} | {
  type: 'Front',
  effect: FrontEffect.Effect,
};

type Control<A> = Ship.Ship<Effect, FrontModel.Commit, FrontModel.State, A>;

function run(): (effect: Effect) => Promise<any> {
  const authRun = AuthRun.run();
  return async effect => {
    switch (effect.type) {
    case 'Auth':
      return authRun(effect.effect);
    case 'Front':
      return FrontRun.run(effect.effect);
    default:
      return;
    }
  };
}

function authControl(action: AuthController.Action): Control<any> {
  return Ship.mapWithAnswer(
    effect => Ship.call({type: 'Auth', effect}),
    commit => commit,
    state => undefined,
    ShipDevTools.inspect(({action}) => AuthController.control(action))({type: 'Auth', action})
  );
}

const control: (action: FrontController.Action) => Control<void> =
  ShipDevTools.inspect(action =>
    Ship.mapWithAnswer(
      function* (effect) {
        switch (effect.type) {
        case 'Api':
          return yield* authControl(effect.action);
        default:
          return yield* Ship.call({type: 'Front', effect});
        }
      },
      commit => commit,
      state => state,
      ShipDevTools.inspect(({action}) => FrontController.control(action))({type: 'Front', action})
    )
  );

const store = createStore(FrontModel.reduce, FrontModel.initialState, devToolsEnhancer());

function dispatch(action: FrontController.Action): void {
  Ship.run(run(), store, control(action));
}

FrontRun.mount(dispatch, store);
