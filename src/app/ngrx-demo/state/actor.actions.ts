import { createActionGroup, props } from '@ngrx/store';
import { Actor } from '../../core/interfaces/movies.interface';

 
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
    'Retrieved Actors List': props<{ actors: ReadonlyArray<Actor> }>(),
  },
});