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
import { NgrxDemoComponent } from './ngrx-demo/ngrx-demo.component';
import { ActorCardComponent } from './core/actor-card/actor-card.component';
import { actorsReducer } from './ngrx-demo/store/actor.reducers';
import { castReducer } from './ngrx-demo/store/cast.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ActorsEffects } from './ngrx-demo/store/actor.effects';


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
    NgrxDemoComponent,
    ActorCardComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ actors: actorsReducer, cast: castReducer,counter: CounterReducer  }),
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
    EffectsModule.forRoot([ActorsEffects]),
  ],
  providers: [   { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true },
    SpinnerService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
