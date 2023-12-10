import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap, throwError } from 'rxjs';
import { Actor } from 'src/app/core/interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class ActorsService {
  url = 'http://localhost:3000/actors';
  constructor(private http: HttpClient) { }

  testSubject:  Subject<string> =  new Subject<string>();
  testBehaviourSubject:BehaviorSubject<string> = new BehaviorSubject<string>('Initial Value');

  testSubject$ = this.testSubject.asObservable();
  testBehaviourSubject$ = this.testBehaviourSubject.asObservable();


  updateSubject(value: string) {
    this.testSubject.next(value);
  }

  updateBehaviorSubject(value: string) {
    this.testBehaviourSubject.next(value);
  }

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
