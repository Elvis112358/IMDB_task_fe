import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Actor } from '../../core/interfaces/movies.interface';

export const selectActors = createFeatureSelector<ReadonlyArray<Actor>>('actors');

export const selectCastState = createFeatureSelector<
  ReadonlyArray<number>
>('cast');

export const selectActorCollection = createSelector(
  selectActors,
  selectCastState,
  (actors, cast) => {
    return cast.map((id) => actors.find((actor) => actor.id === id)!);
  }
);