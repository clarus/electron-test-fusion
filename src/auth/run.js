// @flow
import * as Redis from 'redis';
import * as Effect from './effect';

export function run(): (effect: Effect.Effect) => Promise<any> {
  const redis = Redis.createClient();
  return async effect => {
    switch (effect.type) {
    case 'RedisGet': {
      const {key} = effect;
      return new Promise(resolve => redis.get(key, (error, success) => resolve(success)));
    }
    case 'RedisKeys': {
      const {pattern} = effect;
      return new Promise(resolve => redis.keys(pattern, (error, success) => resolve(success)));
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
