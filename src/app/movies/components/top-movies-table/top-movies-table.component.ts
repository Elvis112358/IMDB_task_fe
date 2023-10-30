import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Filter,
  PagingType,
  Sorting,
  TableDataQuery,
} from '@elvis11235/ngx-generic-table';
import { MoviesService } from '../../movies.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-top-movies-table',
  templateUrl: './top-movies-table.component.html',
  styleUrls: ['./top-movies-table.component.scss'],
})
export class TopMoviesTableComponent implements OnInit, AfterViewInit {
  movies: any[] = [];
  searchedMovies: any[] = [];
  tvShows?: any[] = undefined;
  searchedTvShow?: any[] = [];
  records: number = 10;
  searchKeyTerms: Array<string> = [
    'stars',
    'least',
    'less',
    'more than',
    'after',
    'older than',
  ];

  queryOptionsData: TableDataQuery = new TableDataQuery();
  showSeries = false;
  searchDebounceTime = 300;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private moviesService: MoviesService,
    private navigationService: NavigationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getInitalMovies();
    this.searchedMovies = [...this.movies];
    this.searchedMovies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, this.records);
    this.subscriveToTvShowsToggle();
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged())
      .subscribe((res: any) => {
        console.log('res', res.target.value);
        this.movieSearch(res.target.value);
      });
  }

  subscriveToTvShowsToggle(): void {
    this.navigationService.showTop10Series.subscribe(async (value: boolean) => {
      if (this.input.nativeElement && this.showSeries !== value) {
        this.input.nativeElement.value = '';
      }
      this.showSeries = value;
      if (!this.tvShows) {
        await this.getTvShowData(this.queryOptionsData, 'tv-shows');
      }
      if (this.tvShows && this.showSeries)
        this.searchedTvShow = [
          ...this.tvShows
            .sort((a, b) => b.rating - a.rating)
            .slice(0, this.records),
        ];
      else
        this.searchedMovies = [
          ...this.movies
            .sort((a, b) => b.rating - a.rating)
            .slice(0, this.records),
        ];
    });
  }

  movieSearch(searchTerm: string) {
    // clientSideSearch
    console.log('this.movies', this.movies);
    if (!this.showSeries) {
      this.searchedMovies = [
        ...this.movies
          .filter((movie) => {
            return (
              Object.values(movie).some((value: any) => {
                value = value.toString();
                return value.toLowerCase().includes(searchTerm);
              }) || this.filterByGenericTerms(searchTerm, movie)
            );
          })
          .sort((a, b) => b.rating - a.rating)
          .slice(0, this.records),
      ];
    } else {
      if (this.tvShows) {
        this.searchedTvShow = [
          ...this.tvShows
            .filter((movie) =>{
              return (
                Object.values(movie).some((value: any) => {
                  value = value.toString();
                  return value.toLowerCase().includes(searchTerm);
                }) || this.filterByGenericTerms(searchTerm, movie)
              );
            }
            )
            .sort((a, b) => b.rating - a.rating)
            .slice(0, this.records),
        ];
      }
    }
  }

  async getInitalMovies(pageNumber?: number, pageSize?: number): Promise<any> {
    await this.getMoviesData(this.queryOptionsData);
  }

  filterByGenericTerms(searchTerm: string, movie: any) {
    const regex = /\d+/; // Matches one or more digits
    if (this.searchKeyTerms.some((term) => searchTerm.includes(term))) {
      if (searchTerm.includes(this.searchKeyTerms[0])) {
        const match = searchTerm.match(regex);

        if (match) {
          const number = parseInt(match[0], 10); // Convert the matched string to an integer
          return movie.rating === number;
        }
      } else if (
        searchTerm.includes(this.searchKeyTerms[1]) ||
        searchTerm.includes(this.searchKeyTerms[2])
      ) {
        const match = searchTerm.match(regex);
        if (match) {
          const number = parseInt(match[0], 10); // Convert the matched string to an integer
          return movie.rating < number;
        }
      } else if (searchTerm.includes(this.searchKeyTerms[3])) {
        const match = searchTerm.match(regex);
        if (match) {
          const number = parseInt(match[0], 10); // Convert the matched string to an integer
          return movie.rating > number;
        }
      } else if (searchTerm.includes(this.searchKeyTerms[4])) {
        const match = searchTerm.match(regex);
        if (match) {
          const number = parseInt(match[0], 10); // Convert the matched string to an integer
          return movie.year > number;
        }
      } else if (searchTerm.includes(this.searchKeyTerms[5])) {
        const match = searchTerm.match(regex);
        if (match) {
          const number = parseInt(match[0], 10); // Convert the matched string to an integer
          return movie.year < number;
        }
      }
    }
    return false;
  }

  onSearchTermChange(newValue: string) {
    // This method will be called whenever the input value changes.
    console.log('Search term changed:', newValue);
    // You can perform any actions or logic here.
  }

  private async getMoviesData(queryData: TableDataQuery): Promise<any> {
    return new Promise((resolve, reject) => {
      this.moviesService
        .getData(queryData)
        .then((response) => {
          if (response) {
            this.movies = response.body;
            console.log('responseMovies', this.movies);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private async getTvShowData(
    queryData: TableDataQuery,
    urlstring?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.moviesService
        .getData(queryData, urlstring)
        .then((response) => {
          if (response) {
            this.tvShows = response.body;
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  showMoreRecords(): void {
    this.records += 10;
    this.movieSearch('');
  }
}
