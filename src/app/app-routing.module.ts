import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopMoviesTableComponent } from './movies/components/top-movies-table/top-movies-table.component';
import { AllMoviesComponent } from './movies/components/all-movies/all-movies.component';
import { FavMoviesComponent } from './movies/components/fav-movies/fav-movies.component';
import { NgrxDemoComponent } from './ngrx-demo/ngrx-demo.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all-movies'
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
    path:'ngrx-demo',
    component: NgrxDemoComponent
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
