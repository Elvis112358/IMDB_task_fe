import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, throwError } from 'rxjs';
import { Actor } from 'src/app/core/interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class ActorsService {
  url = 'http://localhost:3000/actors';
  constructor(private http: HttpClient) { }

  getActors(): Observable<Array<Actor>> {
    return this.http.get<Actor[]>(this.url).pipe(map((actors) => actors || []));
  }

  addActor(actor: Actor): Observable<Actor> {
    return this.http.post<Actor>(this.url, actor);
  }

  removeActor(actorId: number):Observable<Actor> {
    if (actorId === 1) {
      // Create a new HttpErrorResponse and return it using throwError
      const errorResponse = new HttpErrorResponse({
        error: {
          message: 'Cannot delete actor with id 1'
        },
        status: 400,
        statusText: 'Bad Request',
      });
      return throwError(() => errorResponse);
    }
    return this.http.delete<Actor>(`${this.url}/${actorId}`)
  }
}
