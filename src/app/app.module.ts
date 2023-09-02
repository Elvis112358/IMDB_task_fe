import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

@NgModule({
  declarations: [
    AppComponent,
    MenuListComponent,
    TopMoviesTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    AppRoutingModule,
    NgxGenericTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
