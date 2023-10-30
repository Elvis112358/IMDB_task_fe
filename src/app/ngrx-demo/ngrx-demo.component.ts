import { Component } from '@angular/core';
import { selectActorCollection, selectActors } from './state/actor.selectors';
import { ActorActions, ActorsApiActions } from './state/actor.actions';
import { ActorsService } from './services/actors.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-ngrx-demo',
  templateUrl: './ngrx-demo.component.html',
  styleUrls: ['./ngrx-demo.component.scss']
})
export class NgrxDemoComponent {
  actors$ = this.store.select(selectActors);
  bookCollection$ = this.store.select(selectActorCollection);
 
  constructor(private actorsService: ActorsService, private store: Store) {}
 
  ngOnInit() {
    this.actorsService
      .getActors()
      .subscribe((actors) => {
        console.log('actors', actors);
        return this.store.dispatch(ActorsApiActions.retrievedActorsList({ actors }));
      }
      
      );
  }

  onAdd(actorId: number) {
    this.store.dispatch(ActorActions.addActor({ actorId }));
  }

  onRemove(actorId: number) {
    this.store.dispatch(ActorActions.removeActor({ actorId }));
  }
 
}
