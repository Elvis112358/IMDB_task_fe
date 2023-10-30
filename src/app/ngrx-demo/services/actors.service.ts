import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Actor } from 'src/app/core/interfaces/movies.interface';

@Injectable({
  providedIn: 'root'
})
export class ActorsService {
  url = 'http://localhost:3000/actors';
  constructor(private http: HttpClient) { }

  getActors(): Observable<Array<Actor>> {
    return this.http.get<Actor[]>(this.url).pipe(tap( stream =>console.log('stram', stream)),map((actors) => actors || []));
  }
}
