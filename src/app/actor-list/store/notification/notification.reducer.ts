import { createReducer, on } from "@ngrx/store";
import { ActorActions, ActorsApiActions } from "../actor/actor.actions";
import { initialNotificationState } from "../app.state";

export const notificationReducer = createReducer(
    initialNotificationState,
    on(ActorsApiActions.getActorsListError, (_state, { error }) => {
      return error;
    }),
    on(ActorActions.addActorError, (_state, { error }) => {
      return error;
    }),
    on(ActorActions.removeActorError, (_state, { error }) => {
      return error;
    })
  );