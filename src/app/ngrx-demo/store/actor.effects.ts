import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ActorsApiActions } from "./actor.actions";
import { map, switchMap } from "rxjs";
import { ActorsService } from "../services/actors.service";
import { Actor } from "src/app/core/interfaces/common.interface";

@Injectable() 
export class ActorsEffects {

    constructor(private actions$: Actions, private actorsService: ActorsService) {}
    retrieveActors$ = createEffect(() => 
    this.actions$.pipe(
        ofType(ActorsApiActions.retrieveActorsList),
        switchMap(() => 
            this.actorsService.getActors().pipe(
                map((actors: Actor[]) => ActorsApiActions.retrievedActorsList({ actors }))
            )
        )
    )
);
}