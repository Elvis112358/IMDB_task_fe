import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest, concatMap, debounceTime, interval, map, of, startWith, switchMap, pairwise, take, tap, withLatestFrom } from 'rxjs';
import { Banner } from '../../interfaces/common.interface';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  banners$: Observable<Banner[]> = inject(BannerService).getBanners();

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
  readonly bannerInterval = 4000;
  // private activeIndex = new BehaviorSubject(0);
  // activeIndex$ = this.activeIndex.asObservable();
  currentBannerIndex = 0;
  actionStreamBS: BehaviorSubject<number> = new BehaviorSubject(0);
  actionStream$: Observable<number> = this.actionStreamBS.asObservable().pipe(startWith(0));
  interval$:Observable<number> = interval(this.bannerInterval)
  .pipe(
    startWith(0),
    switchMap(() =>
      this.actionStream$.pipe(
        debounceTime(this.bannerInterval - 100),
        map(() => this.currentBannerIndex + 1)
      )
    )
  );
  // banner$ = combineLatest([this.banners$, this.actionStream$]).pipe(
  //   tap(()=>console.log('this.CurrentIndex', this.currentBannerIndex)),
  //   map(([banners, action]: [Banner[], number]) => {
  //     return this.getBannerForSlider(banners, action)
  //   })
  // );
  banner$ = combineLatest([this.banners$, this.actionStream$.pipe(pairwise()), this.interval$.pipe(pairwise())])
    .pipe(
      map(([banners, [prevAction, action], [prevInterval, currInterval]]: [Banner[], [number, number], [number, number]]) => {
        
        console.log('prevAction', prevAction);
        console.log('action', action);
        console.log('prevInterval', prevInterval);
        console.log('currInterval', currInterval);
        console.log('currentBannerIndex', this.currentBannerIndex);
        console.log(')_________ ');

        if(action > currInterval && action > prevAction) {
        
          console.log('KLIKNO DESNO');
          return this.getBannerForSlider(banners, action)
        }

        // if() {
          if((action < this.currentBannerIndex) && (action === prevInterval || action < currInterval && action < prevAction)) {
          console.log('KLIKNO LIJEVO');
          return this.getBannerForSlider(banners, action)
        }
        return this.getBannerForSlider(banners, currInterval)
      })
    )

  ngOnInit(): void {
    // this.bannerSlider();
  }

  // nextBannerIndexInterval(): Observable<number | null> {
  //   return interval(this.bannerInterval)
  //     .pipe(
  //       startWith(0),
  //       switchMap(() =>
  //         this.actionStream$.pipe(
  //           debounceTime(this.bannerInterval - 100),
  //           map(() => this.currentBannerIndex + 1)
  //         )
  //       )
  //     )
  // }

  nextBannerChange() {
    this.actionStreamBS.next(this.currentBannerIndex - 1) //TODO promjeniti ime event emitera
  }

  previousBannerChange() {
    this.actionStreamBS.next(this.currentBannerIndex + 1)
  }

  private getBannerForSlider(banners : Banner[], index: number): Banner {
    const calculatedIndex = index % banners.length;
    let indexToReturn =
      calculatedIndex < 0
        ? calculatedIndex + banners.length
        : calculatedIndex;
    this.currentBannerIndex  = index;
    return banners[indexToReturn];
  }
}
