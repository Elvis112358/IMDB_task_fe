import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../movies.service';
import { Observable, of } from 'rxjs';
import { AppState, CounterState, Movie } from 'src/app/core/interfaces/common.interface';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-fav-movies',
  templateUrl: './fav-movies.component.html',
  styleUrls: ['./fav-movies.component.scss']
})
export class FavMoviesComponent implements OnInit{
  favMovies$:Observable<Movie[]> = of([]);
  counter$:Observable<number> = of(0);

  constructor(
    private moviesService: MoviesService,
    private store: Store<AppState>
  ) {}
  ngOnInit(): void {
    this.counter$ = this.store.select(state => state.counter?.count);
    this.favMovies$ = this.moviesService.getFavoriteMovies();
  }

}
