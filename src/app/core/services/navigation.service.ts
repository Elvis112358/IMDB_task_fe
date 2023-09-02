import { Injectable } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Event, Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public isOpen:boolean = true;
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string | undefined>(undefined);
  sidenavMode : MatDrawerMode = 'side';
  
  constructor(private router: Router) {
    /**
     * Subscribe to router changes and change current url
     */
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  /**
   * Show / hide sidebar
   * @param isOpen 
   */
  ToogleSidebar(isOpen:boolean){
    this.isOpen = isOpen;
  }
}
