import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopMoviesTableComponent } from './movies/components/top-movies-table/top-movies-table.component';
import { AllMoviesComponent } from './movies/components/all-movies/all-movies.component';
import { FavMoviesComponent } from './movies/components/fav-movies/fav-movies.component';
import { ActorListComponent } from './actor-list/actor-list.component';
import { BannersComponent } from './core/components/banners/banners.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all-movies'
  },
  {
    path:'banners',
    component: BannersComponent
  },
  {
    path: 'all-movies',
    component: AllMoviesComponent,
  },
  {
    path: 'top-movies',
    component: TopMoviesTableComponent,
  },
  {
    path:'fav-movies',
    component: FavMoviesComponent
  }, {
    path:'actor-list',
    component: ActorListComponent
  }
  // {
  //   path: 'sorting',
  //   component: LayoutComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
