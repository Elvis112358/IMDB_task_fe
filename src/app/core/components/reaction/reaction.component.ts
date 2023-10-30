import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces/common.interface';
import * as CounterActions from '../../../movies/store/counter/counter.actions'

@Component({
  selector: 'app-reaction-component',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent {
  constructor(private store: Store<AppState>) { }
  decrementCounter() {
    this.store.dispatch(new CounterActions.Decrement);
  }
  incrementCounter() {
    debugger
    this.store.dispatch(new CounterActions.Increment());
  }
}
