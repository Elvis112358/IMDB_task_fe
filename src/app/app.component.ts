import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { UserNavigationItems, PermissionNavigationItems, RouterPageDescriptions } from './core/navigation-items';
import { NavigationService } from './core/services/navigation.service';
import { Store } from '@ngrx/store';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { selectNotifications } from './actor-list/store/notification/notification.selectors';
import { ActorsService } from './actor-list/services/actors.service';

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
  notifications$ = this.store.select(selectNotifications);
  userNavigationItems = UserNavigationItems;
  permissionNavigationItems = PermissionNavigationItems;

  private pageDescriptions = RouterPageDescriptions;
  public page: string | undefined;

  constructor(
    public navigationService: NavigationService,
    private store: Store,
    private toast: ToastrService,
    private actorsService: ActorsService
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
    this.notifications$.subscribe((err: HttpErrorResponse) => { this.toast.error(err.error.message ?? err.message)})
    this.subscribeToSubjectAndBehaviorSubject()
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

  subscribeToSubjectAndBehaviorSubject(): void {
    console.log('subscribeToSubjectAndBehaviorSubject-appComponent');
    this.actorsService.testSubject$.subscribe(test => console.log('testSubject', test));
    this.actorsService.testBehaviourSubject$.subscribe(test => console.log('testBehaviourSubject', test));
  }

  updateSubjectBehaviourSubject() {
    this.actorsService.updateSubject('updateSubject');
    this.actorsService.updateBehaviorSubject('updateBehaviorSubject');
  }

  onToggleChange(event: MatButtonToggleChange) {
    console.log('onToggleChange', event);
    if(event.value === 'clicked') {
      this.isToggleClicked = !this.isToggleClicked;
      this.navigationService.showTop10Series.next(this.isToggleClicked);
    }
  }
}
