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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FavMoviesComponent } from './movies/components/fav-movies/fav-movies.component';
import { MovieDetailsComponent } from './core/components/movie-details/movie-details.component';
import { ReactionComponent } from './core/components/reaction/reaction.component';
import { StoreModule } from '@ngrx/store';
import { CounterReducer } from './movies/store/counter/counter.reducer';
// import { castReducer } from './actor-list/store/cast.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ActorListComponent } from './actor-list/actor-list.component';
import { actorsReducer } from './actor-list/store/actor/actor.reducers';
import { ActorsEffects } from './actor-list/store/actor/actor.effects';
import { MatDialogModule } from '@angular/material/dialog';
import { notificationReducer } from './actor-list/store/notification/notification.reducer';
import { AddActorFormComponent } from './actor-list/core/add-actor-form/add-actor-form.component';
import { ActorCardComponent } from './actor-list/core/actor-card/actor-card.component';
import { BannerComponent } from './core/components/banners/banner/banner.component';
import { BannersComponent } from './core/components/banners/banners.component';
import { PfdsFormComponent } from './core/pfds-form/pfds-form.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComments, faFilePdf, faHouse, faPaperclip, faPersonCircleQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMapsComponent } from './leaflet-maps/leaflet-maps.component';


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
    ActorListComponent,
    ActorCardComponent,
    AddActorFormComponent,
    BannerComponent,
    BannersComponent,
    PfdsFormComponent,
    ChatComponent,
    GoogleMapsComponent,
    LeafletMapsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    StoreModule.forRoot({ actors: actorsReducer,counter: CounterReducer, notification: notificationReducer  }),
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    AppRoutingModule,
    NgxGenericTableModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
    MatButtonToggleModule,
    FormsModule,
    EffectsModule.forRoot([ActorsEffects]),
    ReactiveFormsModule,
    ScrollingModule ,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FontAwesomeModule,
    LeafletModule
  ],
  providers: [   { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true },
    SpinnerService,],
  bootstrap: [AppComponent]
})
export class AppModule { constructor(library: FaIconLibrary) {
  library.addIcons(
    faPaperclip,
    faFilePdf,
    faHouse,
    faComments,
    faPersonCircleQuestion,
    faUser
  );
} }
