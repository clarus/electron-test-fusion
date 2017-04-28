// @flow
import * as Ship from 'redux-ship';

export type Effect = {
  type: 'RedisGet',
  key: string,
} | {
  type: 'RedisKeys',
  pattern: string,
} | {
  type: 'RedisSet',
  key: string,
  value: string,
};

export type Control<A> = Ship.Ship<Effect, empty, void, A>;

export function redisGet<Commit, State>(
  key: string
): Control<?string> {
  return Ship.call({type: 'RedisGet', key});
}

export function redisKeys<Commit, State>(
  pattern: string
): Control<string[]> {
  return Ship.call({type: 'RedisKeys', pattern});
}

export function redisSet<Commit, State>(
  key: string,
  value: string
): Control<void> {
  return Ship.call({type: 'RedisSet', key, value});
}
