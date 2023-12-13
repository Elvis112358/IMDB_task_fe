import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, concatMap, debounceTime, interval, startWith } from 'rxjs';
import { Banner } from '../../interfaces/common.interface';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  // styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit{
  banners$: Observable<Banner[]> = inject(BannerService).getBanners();
  readonly bannerInterval = 3500;
  
  private activeIndex = new BehaviorSubject(0);
  activeIndex$ = this.activeIndex.asObservable();


  ngOnInit(): void {
    this.startActiveIndexCalculation()
  }


  startActiveIndexCalculation() {
    console.log('startActiveIndexCalculation');
    combineLatest([
      interval(this.bannerInterval)
        .pipe(
          startWith(0),
          concatMap(() => this.activeIndex$.pipe(debounceTime(this.bannerInterval - 100))),
        )
      ,
      this.banners$]
    )
    .subscribe(([currentIndex, banners]) => this.onPageChange(currentIndex + 1, banners));
  }

  onPageChange(newIndex: number, banners: Banner[]) {
    console.log('newIndex', newIndex, 'banners', banners);
    if(banners[newIndex])
      this.activeIndex.next(newIndex);
    else if(newIndex > banners.length-1)
      this.activeIndex.next(0);
    else
      this.activeIndex.next(banners.length-1);
  }
}
