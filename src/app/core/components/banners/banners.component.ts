import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest, concatMap, debounceTime, interval, map, of, startWith, switchMap, take, tap } from 'rxjs';
import { Banner } from '../../interfaces/common.interface';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  banners$: Observable<Banner[]> = inject(BannerService).getBanners();
  banner$: Observable<Banner> = of();

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
  readonly bannerInterval = 3500;

  private activeIndex = new BehaviorSubject(0);
  activeIndex$ = this.activeIndex.asObservable();
  currentBannerIndex = 0;
  currentInterval = 0;
  actionStreamBS: BehaviorSubject<number> = new BehaviorSubject(0);
  actionStream$: Observable<number> = this.actionStreamBS.asObservable();

  ngOnInit(): void {
    this.bannerSlider();
  }

  bannerSlider() {
    this.banner$ = combineLatest([
      interval(this.bannerInterval).pipe(
        startWith(0),
        concatMap(() =>
          this.actionStream$.pipe(
            debounceTime(this.bannerInterval - 100),
            tap(() => this.onPageChange(this.currentBannerIndex + 1))
          )
        )
      ),
      this.banners$,
      this.actionStream$,
    ]).pipe(
      // tap(([_, __, ___]: [number, Banner[], number]) => {
      //   console.log('this.currentBannerIndex', this.currentBannerIndex);
      //   console.log('this.currentInterval', this.currentInterval);
      // }),
      map(([_, banners, action]: [number, Banner[], number]) => {
        const calculatedIndex = action % banners.length;
        let indexToReturn =
          calculatedIndex < 0
            ? calculatedIndex + banners.length
            : calculatedIndex;
        this.currentBannerIndex = this.currentInterval = action;
        return banners[indexToReturn];
      })
    );
  }

  onPageChange(newIndex: number): void {
    this.actionStreamBS.next(newIndex);
  }
}
