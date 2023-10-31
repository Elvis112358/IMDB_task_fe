import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Actor } from 'src/app/core/interfaces/common.interface';

 
export const ActorActions = createActionGroup({
  source: 'Actors',
  events: {
    'Add Actor': props<{ actorId: number }>(),
    'Remove Actor': props<{ actorId: number }>(),
    'Get Actor': props<{ actorId: number }>(),
  },
});
 
export const ActorsApiActions = createActionGroup({
  source: 'Actors API',
  events: {
    'Retrieve Actors List': emptyProps(),
    'Retrieved Actors List': props<{ actors: ReadonlyArray<Actor> }>(),
  },
});