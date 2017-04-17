// @flow
import * as Redis from 'redis';
import * as Ship from 'redux-ship';

export type Effect = {
  type: 'HttpRequest',
  url: string,
} | {
  type: 'RedisGet',
  key: string
} | {
  type: 'RedisSet',
  key: string,
  value: string
};

export function run(): (effect: Effect) => Promise<any> {
  const redis = Redis.createClient();
  return async effect => {
    switch (effect.type) {
    case 'HttpRequest': {
      const response = await fetch(effect.url.replace('http://', 'https://'));
      return await response.json();
    }
    case 'RedisGet': {
      const {key} = effect;
      return new Promise(resolve => redis.get(key, (error, success) => resolve(success)));
    }
    case 'RedisSet': {
      const {key, value} = effect;
      return new Promise(resolve => redis.set(key, value, resolve));
    }
    default:
      return;
    }
  };
}

export function httpRequest<Commit, State>(
  url: string
): Ship.Ship<Effect, Commit, State, any> {
  return Ship.call({type: 'HttpRequest', url});
}

export function redisGet<Commit, State>(
  key: string
): Ship.Ship<Effect, Commit, State, ?string> {
  return Ship.call({type: 'RedisGet', key});
}

export function redisSet<Commit, State>(
  key: string,
  value: string
): Ship.Ship<Effect, Commit, State, void> {
  return Ship.call({type: 'RedisSet', key, value});
}
