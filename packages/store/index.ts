import { createLogger } from './createLogger';
import { createStore, hydrateStateActionType } from './createStore';

export type { AnyAction } from 'redux';

export * from './create';
export * from './createLogger';
export * from './createStore';

export const { Store, getState, useStore, useDispatch } = createStore(
  /* istanbul ignore next */
  process.env.NODE_ENV === 'development'
    ? [
        createLogger({
          filter: ({ type }) => type !== hydrateStateActionType,
          prefix: 'global',
        }),
      ]
    : [],
);