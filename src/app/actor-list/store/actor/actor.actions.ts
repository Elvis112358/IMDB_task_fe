import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Actor } from 'src/app/core/interfaces/common.interface';

 
export const ActorActions = createActionGroup({
  source: 'Actors',
  events: {
    'Add Actor': props<{actor: Actor}>(),
    'Add Actor Error': props<{error: any }>(),
    'Remove Actor': props<{ actorId: number }>(),
    'Remove Actor Error': props<{error: any }>()
  },
});
 
export const ActorsApiActions = createActionGroup({
  source: 'Actors API',
  events: {
    'Get Actors List': emptyProps(),
    'Get Actors List Sucess': props<{ actors: ReadonlyArray<Actor> }>(),
    'Get Actors List Error': props<{ error: any }>(),
  },
});