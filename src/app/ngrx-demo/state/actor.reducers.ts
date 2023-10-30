import { createReducer, on } from '@ngrx/store';
import { ActorsApiActions } from './actor.actions';
import { Actor } from '../../core/interfaces/movies.interface';


export const initialState: ReadonlyArray<Actor> = [];

export const actorsReducer = createReducer(
  initialState,
  on(ActorsApiActions.retrievedActorsList, (_state, { actors }) => actors)
);