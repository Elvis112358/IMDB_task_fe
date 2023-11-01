import { createReducer, on } from '@ngrx/store';
import { ActorsApiActions } from './actor.actions';
import { initialState } from './actor.state';




export const actorsReducer = createReducer(
  initialState,
  on(ActorsApiActions.getActorsListSucess, (_state, { actors }) => {
    console.log('teeest', actors);
    return actors;
  })
);