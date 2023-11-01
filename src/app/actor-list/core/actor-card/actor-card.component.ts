import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Actor } from '../../../core/interfaces/common.interface';
import { Store } from '@ngrx/store';
import { ActorActions } from '../../store/actor/actor.actions';

@Component({
  selector: 'app-actor-card',
  templateUrl: './actor-card.component.html',
  styleUrls: ['./actor-card.component.scss']
})
export class ActorCardComponent {
  @Input() actor?: Actor;
  constructor(private store: Store) {
  }
  onRemove(actor?: Actor) {
    if(actor && actor.id) {
      this.store.dispatch(ActorActions.removeActor({ actorId: actor.id }));
    }
  }
}
