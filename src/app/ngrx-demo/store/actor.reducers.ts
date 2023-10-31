import { createReducer, on } from '@ngrx/store';
import { ActorsApiActions } from './actor.actions';
import { Actor } from 'src/app/core/interfaces/common.interface';


export const initialState: ReadonlyArray<Actor> = [];

export const actorsReducer = createReducer(
  initialState,
  on(ActorsApiActions.retrievedActorsList, (_state, { actors }) => {
    console.log('teeest', actors);
    return actors;
  })
);