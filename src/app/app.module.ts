import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MenuListComponent } from './core/components/menu-list/menu-list.component';
import { MatIconModule } from '@angular/material/icon';
import { TopMoviesTableComponent } from './movies/components/top-movies-table/top-movies-table.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxGenericTableModule } from '@elvis11235/ngx-generic-table';
import { AllMoviesComponent } from './movies/components/all-movies/all-movies.component';
import { SpinnerOverlayComponent } from './core/components/spinner-overlay/spinner-overlay.component';
import { SpinnerService } from './core/services/spinner.service';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCustomInterceptor } from './core/http.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { RatingStarComponent } from './core/components/rating-star/rating-star.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { FavMoviesComponent } from './movies/components/fav-movies/fav-movies.component';

import { MovieDetailsComponent } from './core/components/movie-details/movie-details.component';
import { ReactionComponent } from './core/components/reaction/reaction.component';
import { StoreModule } from '@ngrx/store';
import { CounterReducer } from './movies/store/counter/counter.reducer';


@NgModule({
  declarations: [
    AppComponent,
    MenuListComponent,
    TopMoviesTableComponent,
    AllMoviesComponent,
    SpinnerOverlayComponent,
    RatingStarComponent,
    FavMoviesComponent,
    ReactionComponent,
    MovieDetailsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    AppRoutingModule,
    NgxGenericTableModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
    MatButtonToggleModule,
    FormsModule,
    StoreModule.forRoot({ counter: CounterReducer })
  ],
  providers: [   { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true },
    SpinnerService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
