import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest, concatMap, debounceTime, interval, map, of, startWith, switchMap, pairwise, take, tap, withLatestFrom } from 'rxjs';
import { Banner } from '../../interfaces/common.interface';
import { BannerService } from '../../services/banner.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FadeIn } from '../../animation';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
  animations: [FadeIn(200, true)]
})
export class BannersComponent {
  banners$: Observable<Banner[]> = inject(BannerService).getBanners();

  isMFAOptedTest = false;

  defaultBanner: Banner = {
    active: false,
    buttonText: 'Register',
    id: '9ea0cbe6-0223-4207-a17f-5890330b6889',
    scope: 'BRAND',
    scopeId: '5223e12b-644c-411c-aebe-f924253c9da3',
    subtitle: undefined,
    title: 'Give your car the best treat',
    type: 'HOME',
    url: '/login',
    validFrom: new Date('2023-12-05T23:00:00Z'),
    validTo: new Date('2023-12-14T23:00:00Z'),
    version: 1,
    image:
      'https://img.freepik.com/premium-photo/bangkok-thailand-08082022-lamborghini-luxury-super-car-fast-sports-premium-lighting-background-3d-illustration_67092-1599.jpg',
  };
  readonly bannerInterval = 3000;

  currentBannerIndex = 0;
  actionStreamBS: BehaviorSubject<number> = new BehaviorSubject(0);
  actionStream$: Observable<number> = this.actionStreamBS
    .asObservable()
    .pipe(startWith(0));
  interval$: Observable<number> = interval(this.bannerInterval).pipe(
    startWith(0),
    switchMap(() =>
      this.actionStream$.pipe(
        debounceTime(this.bannerInterval - 100),
        map(() => this.currentBannerIndex + 1)
      )
    )
  );

  trigger: 'action' | 'interval' = 'interval';
  banner$ = combineLatest([
    this.banners$,
    this.actionStream$.pipe(tap(() => (this.trigger = 'action'))),
    this.interval$.pipe(tap(() => (this.trigger = 'interval'))),
  ]).pipe(
    map(([banners, action, interval]: [Banner[], number, number]) =>
      this.getBannerForSlider(
        banners,
        this.trigger === 'action' ? action : interval
      )
    )
  );

  nextBannerChange() {
    this.actionStreamBS.next(this.currentBannerIndex - 1); //TODO promjeniti ime event emitera
  }

  previousBannerChange() {
    this.actionStreamBS.next(this.currentBannerIndex + 1);
  }

  private getBannerForSlider(banners: Banner[], index: number): Banner {
    const calculatedIndex = index % banners.length;
    let indexToReturn =
      calculatedIndex < 0 ? calculatedIndex + banners.length : calculatedIndex;
    this.currentBannerIndex = index;
    return banners[indexToReturn];
  }
  functionTest() {
    console.log('okinulo funkcijue')
  }
}
