import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActorActions, ActorsApiActions } from './actor.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ActorsService } from '../../services/actors.service';
import { Actor } from 'src/app/core/interfaces/common.interface';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ActorsEffects {
  constructor(
    private actions$: Actions,
    private actorsService: ActorsService,
    private toast: ToastrService
  ) {}
  retrieveActors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActorsApiActions.getActorsList),
      switchMap(() =>
        this.actorsService.getActors().pipe(
          map((actors: Actor[]) =>
            ActorsApiActions.getActorsListSucess({ actors })
          ),
          catchError((err: HttpErrorResponse) =>
            of(ActorsApiActions.getActorsListError({ error: err }))
          )
        )
      )
    )
  );

  addActor$ = createEffect(()=>
  this.actions$.pipe(
    ofType(ActorActions.addActor),
    mergeMap(({actor})=> 
      this.actorsService.addActor(actor).pipe(
        map(ActorsApiActions.getActorsList),
        catchError((err: HttpErrorResponse) => of(ActorActions.addActorError({ error: err })))
        )
    )
  ))

  removeActor$ = createEffect(()=>
  this.actions$.pipe(
    ofType(ActorActions.removeActor),
    mergeMap(({actorId}) => 
    this.actorsService.removeActor(actorId).pipe(
      map(ActorsApiActions.getActorsList),
      catchError((err: HttpErrorResponse) => of(ActorActions.removeActorError({ error: err })))
      )
    )
  )
  )
}
