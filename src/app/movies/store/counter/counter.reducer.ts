import { Action } from "@ngrx/store";
import * as CounterActions from "./counter.actions";

export function CounterReducer(state = {
    count: 0
  },  action : Action) {
  switch (action.type) {
    case CounterActions.INCREMENT:
      return { count: state.count + 1 };
    case CounterActions.DECREMENT:
      return { count: state.count - 1 };
    default:
      return state;
  }
}