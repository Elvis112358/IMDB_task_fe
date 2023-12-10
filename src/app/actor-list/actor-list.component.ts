import { Component } from '@angular/core';
import { selectActorCollection, selectActors } from './store/actor/actor.selectors';
import { ActorActions, ActorsApiActions } from './store/actor/actor.actions';
import { ActorsService } from './services/actors.service';
import { Store } from '@ngrx/store';
import { selectNotifications } from './store/notification/notification.selectors';
import { MatDialog } from '@angular/material/dialog';
import { AddActorFormComponent } from './core/add-actor-form/add-actor-form.component';

@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.scss']
})
export class ActorListComponent {
  actors$ = this.store.select(selectActors);
 
  bookCollection$ = this.store.select(selectActorCollection);
 
  constructor(private actorsService: ActorsService, private store: Store, public dialog: MatDialog) {}
 
  ngOnInit() {
    this.store.dispatch(ActorsApiActions.getActorsList());
    this.subscribeToSubjectAndBehaviorSubject();
  }

  onAdd() {
    this.dialog.open(AddActorFormComponent, {
      width: '500px',
    });
  }

  onRemove(actorId: number) {
    this.store.dispatch(ActorActions.removeActor({ actorId }));
  }

  subscribeToSubjectAndBehaviorSubject(): void {
    console.log('subscribeToSubjectAndBehaviorSubject-actor-list');
    this.actorsService.testSubject$.subscribe(test => console.log('testSubject', test));
    this.actorsService.testBehaviourSubject$.subscribe(test => console.log('testBehaviourSubject', test));
  }

  updateSubjectBehaviourSubject() {
    this.actorsService.updateSubject('updateSubject - actor List');
    this.actorsService.updateBehaviorSubject('updateBehaviorSubject - Actor List');
  }

 
}
