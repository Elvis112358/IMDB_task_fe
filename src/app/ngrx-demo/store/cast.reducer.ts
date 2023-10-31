import { createReducer, on } from '@ngrx/store';
import { ActorActions } from './actor.actions';
 
export const initialState: ReadonlyArray<number> = [];
 
export const castReducer = createReducer(
  initialState,
  on(ActorActions.addActor, (state, { actorId }) =>
    state.filter((id) => id !== actorId)
  ),
  on(ActorActions.removeActor, (state, { actorId }) => {
    if (state.indexOf(actorId) > -1) return state;
 
    return [...state, actorId];
  })
);