import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Actor } from '../interfaces/common.interface';

@Component({
  selector: 'app-actor-card',
  templateUrl: './actor-card.component.html',
  styleUrls: ['./actor-card.component.scss']
})
export class ActorCardComponent implements OnInit,OnChanges{
  
  @Input() actor?: Actor
  ngOnChanges(changes:SimpleChanges): void {
    console.log('actor', changes['actor']);
  }
  ngOnInit(): void {
    console.log('actor', this.actor);
  }
  onRemove(actor?: Actor) {
    console.log('clicked', actor)
  }

}
