import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopMoviesTableComponent } from './movies/components/top-movies-table/top-movies-table.component';
import { AllMoviesComponent } from './movies/components/all-movies/all-movies.component';
import { FavMoviesComponent } from './movies/components/fav-movies/fav-movies.component';
import { ActorListComponent } from './actor-list/actor-list.component';
import { BannersComponent } from './core/components/banners/banners.component';
import { PfdsFormComponent } from './core/pfds-form/pfds-form.component';
import { ChatComponent } from './chat/chat.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'banners',
  },
  {
    path: 'banners',
    component: BannersComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
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
    path: 'fav-movies',
    component: FavMoviesComponent,
  },
  {
    path: 'actor-list',
    component: ActorListComponent,
  },
  {
    path: 'form-example', 
    component: PfdsFormComponent
  },
  {
    path: 'google-maps', 
    component: GoogleMapsComponent
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
