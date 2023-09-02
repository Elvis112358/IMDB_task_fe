import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { UserNavigationItems, PermissionNavigationItems, RouterPageDescriptions } from './core/navigation-items';
import { NavigationService } from './core/services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'imdbFront';
  @ViewChild("sidenavContainer", { static: false })
  sideNavContainer!: MatSidenavContainer;

  userNavigationItems = UserNavigationItems;
  permissionNavigationItems = PermissionNavigationItems;

  private pageDescriptions = RouterPageDescriptions;
  public page: string | undefined;

  constructor(
    public navigationService: NavigationService
  ) {
    //subscribe to router change so we can display "breadcrumb"
    this.navigationService.currentUrl.subscribe(value => {
      if(value)
        this.page = this.pageDescriptions.find(x => value.includes(x.url))?.text;
    });
  }

  ngOnInit(): void {
    //check user screen witth and set sidebar mode
    if (window.innerWidth > 1280) {
      this.navigationService.sidenavMode = 'side';
      this.navigationService.isOpen = true;
    }
    else {
      this.navigationService.sidenavMode = 'over';
      this.navigationService.isOpen = false;
    }
  }

  ngAfterViewInit() {
    //sometimes sidebar margins are not right so we need to set them manually
    setTimeout(() => {
      this.sideNavContainer.updateContentMargins();
    }, 0);
  }

  ngOnDestroy(): void {
    //unsubscribe from navigation service to prevent memory leaks
    this.navigationService.currentUrl.unsubscribe();
  }
}
