import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { UserNavigationItems, PermissionNavigationItems, RouterPageDescriptions } from './core/navigation-items';
import { NavigationService } from './core/services/navigation.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'imdbFront';
  showToggle:boolean = false;
  isToggleClicked = false;
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
      if(value) {
        this.page = this.pageDescriptions.find(x => value.includes(x.url))?.text;
        //show toggle on TOP 10 MOVIES
        this.showToggle = this.page === 'Top 10 Movies'
      }

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

  onToggleChange(event: MatButtonToggleChange) {
    if(event.value === 'clicked') {
      this.isToggleClicked = !this.isToggleClicked;
      this.navigationService.showTop10Series.next(this.isToggleClicked);
    }
  }
}
