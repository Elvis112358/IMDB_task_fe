import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  // styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent {
  state: string = 'default';
  @Input() item: any;
  constructor(
    public navigationService: NavigationService,
    public router: Router
  ) {}
  /**
   * redirect to provided route
   * if small screen hide sidebar
   * @param item
   */
  onItemSelected(item: any) {
    if (item) {
      this.router.navigate([item.route]);
      if (this.navigationService.sidenavMode == 'over')
        this.navigationService.isOpen = false;
    }
  }
}
