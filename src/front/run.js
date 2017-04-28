// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import * as Constroller from './controller';
import * as Effect from './effect';
import Index from './view';

export async function run(effect: Effect.Effect): Promise<any> {
  switch (effect.type) {
  case 'Api':
    console.log('TODO');
    return undefined;
  case 'HttpRequest': {
    const response = await fetch(effect.url.replace('http://', 'https://'));
    return await response.json();
  }
  default:
    return;
  }
}

export function mount(dispatch: (action: Constroller.Action) => void, store: any): void {
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
}
