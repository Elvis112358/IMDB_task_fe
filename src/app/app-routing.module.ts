import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopMoviesTableComponent } from './movies/top-movies-table/top-movies-table.component';
import { AllMoviesComponent } from './movies/all-movies/all-movies.component';

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
