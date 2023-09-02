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
import { TopMoviesTableComponent } from './movies/top-movies-table/top-movies-table.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxGenericTableModule } from '@elvis11235/ngx-generic-table';
import { AllMoviesComponent } from './movies/all-movies/all-movies.component';
import { SpinnerOverlayComponent } from './core/components/spinner-overlay/spinner-overlay.component';
import { SpinnerService } from './core/services/spinner.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCustomInterceptor } from './core/http.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { RatingStarComponent } from './core/components/rating-star/rating-star.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuListComponent,
    TopMoviesTableComponent,
    AllMoviesComponent,
    SpinnerOverlayComponent,
    RatingStarComponent,
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
    ToastrModule.forRoot()
  ],
  providers: [   { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true },
    SpinnerService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
