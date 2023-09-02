import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopMoviesTableComponent } from './movies/top-movies-table/top-movies-table.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all-movies'
  },
  {
    path: 'all-movies',
    component: TopMoviesTableComponent,
  },
  // {
  //   path: 'paging',
  //   component: LayoutComponent,
  // },
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
