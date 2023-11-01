import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Actor } from 'src/app/core/interfaces/common.interface';

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