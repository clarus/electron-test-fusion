// @flow
import * as Ship from 'redux-ship';
import * as AuthController from '../auth/controller';

export type Effect = {
  type: 'Api',
  action: AuthController.Action,
} | {
  type: 'HttpRequest',
  url: string,
};

export type Control<Commit, State, A> = Ship.Ship<Effect, Commit, State, A>;

export function httpRequest<Commit, State>(
  url: string
): Control<Commit, State, any> {
  return Ship.call({type: 'HttpRequest', url});
}

export function apiGet<Commit, State>(
): Control<Commit, State, void> {
  return Ship.call({type: 'Api', action: {type: 'Get'}});
}

export function apiSet<Commit, State>(
  keys: string[],
  value: string
): Control<Commit, State, void> {
  return Ship.call({type: 'Api', action: {type: 'Set', keys, value}});
}
