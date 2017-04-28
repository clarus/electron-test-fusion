// @flow
import * as Ship from 'redux-ship';
import * as Effect from './effect';

export type Action = {
  type: 'Get',
} | {
  type: 'Set',
  keys: string[],
  value: string,
};

export function* control(action: Action): Effect.Control<any> {
  switch (action.type) {
  case 'Get': {
    const keys = yield* Effect.redisKeys('*');
    return yield* Ship.all(keys.map(key => Effect.redisGet(key)));
  }
  case 'Set': {
    const {keys, value} = action;
    yield* Ship.all(action.keys.map(key => Effect.redisSet(key, value)));
    return undefined;
  }
  default:
    return;
  }
}
