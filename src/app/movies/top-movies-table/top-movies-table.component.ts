import { Component, OnInit } from '@angular/core';
import { Filter, FilterDataType, FixedPosition, PagingType, SelectFilterOptions, Sorting, TableDataQuery, Template } from '@elvis11235/ngx-generic-table';
import { User } from '../../core/interfaces/movies.interface';
import { MoviesService } from '../movies.service';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-top-movies-table',
  templateUrl: './top-movies-table.component.html',
  styleUrls: ['./top-movies-table.component.scss']
})
export class TopMoviesTableComponent implements OnInit {
  Template = Template;
  movies: any[] = [];
  tvShows?: any[]  = undefined;

  // SET SERVER OR CLIENT SIDE PAGINATION SORTING AND FILTERING
  pagingType: PagingType = PagingType.SERVER_SIDE;
  // SET PAGE SIZE FOR PAGINTAION
  pageSize: number = 10;
  queryOptionsData: TableDataQuery = new TableDataQuery();
  showSeries = false;



  constructor(private usersService: MoviesService, private navigationService:NavigationService) {}

  async ngOnInit(): Promise<void> {
    this.queryOptionsData.pageSize = this.pageSize;
    await this.getInitalUsers();
    this.subscriveToTvShowsToggle();
  }
  
  subscriveToTvShowsToggle(): void {
    this.navigationService.showTop10Series.subscribe(async (value:boolean) => {
      this.showSeries = value
      if(!this.tvShows) {
        await this.getTvShowData(this.queryOptionsData, 'tv-shows');
      }
    })
  }

  async getInitalUsers(pageNumber?: number, pageSize?: number): Promise<any> {
    this.queryOptionsData.setPageSize(pageSize);
    this.queryOptionsData.setCurrentPage(pageNumber);
    await this.getUsersData(this.queryOptionsData);
    if (this.pagingType === PagingType.SERVER_SIDE) {
      // apply paging for first page
      await this.pageChanged(1);
    }
  }

  //in case of server side paging we emit event on pageChanged
  async pageChanged(currentPage: number): Promise<void> {
    this.queryOptionsData.setCurrentPage(currentPage);
    this.getUsersData(this.queryOptionsData);
  }

  serverHandledSorting(sortData: Sorting) {
    this.queryOptionsData.setSorting(sortData);
    this.getUsersData(this.queryOptionsData);
  }

  serverHendledFiltering(filterData: Filter) {
    this.queryOptionsData.setCurrentPage(1);
    if (filterData && Array.isArray(filterData.value)) {
      const tempArray = filterData.value.map((date) => {
        if (date instanceof Date && !isNaN(date.getTime())) {
          return date.toISOString();
        } else return date.toString();
      });
      filterData.value = tempArray;
    }
    this.queryOptionsData.setFiltering(filterData);
    this.getUsersData(this.queryOptionsData);
  }

  private async getUsersData(queryData: TableDataQuery): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usersService
        .getData(queryData)
        .then((response) => {
          if (response) {
            this.movies = response.body;
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  private async getTvShowData(queryData: TableDataQuery, urlstring?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usersService
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

  rtnImageSrc(name: string): string {
    const images = [
      'assets/andale.png',
      'assets/ilma.png',
      'assets/dzanke.png',
      'assets/elva.png'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];

  }

  calculateDate(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const diffInMilliseconds = Math.abs(
      new Date(endDate).getTime() - new Date(startDate)?.getTime()
    );
    let daysBetween = Math.round(diffInMilliseconds / oneDay);
    return daysBetween / 365;
  }

}
