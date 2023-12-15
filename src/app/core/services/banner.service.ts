import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Banner } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  // private dialogService = inject(DialogService)

  getBanners(): Observable<Banner[]> {
    return of(banners);
  }

  // checkAndShowEligiblePopupBanner(): void {
  //     banners
  //         .filter((b: Banner) => b.type == BannerType[BannerType.POPUP])
  //         .forEach((b: Banner) => {
  //             this.dialogService.showCustomDialog(PopupBannerComponent, )
  //         })
  // }
}
const banners: Banner[] = [
  {
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
  },
  {
    active: false,
    buttonText: 'Get your bonus today',
    id: '9ea0cbe6-0223-4207-a17f-5890330b6889',
    scope: 'BRAND',
    scopeId: '5223e12b-644c-411c-aebe-f924253c9da3',
    subtitle: undefined,
    title: 'Give your car the best treat 1',
    type: 'HOME',
    url: '/login',
    validFrom: new Date('2023-12-05T23:00:00Z'),
    validTo: new Date('2023-12-14T23:00:00Z'),
    version: 1,
    image:
      'https://www.sixt.com/magazine/wp-content/uploads//sites/6/2022/04/Bugatti-Bolide-Hypercar-resize-1024x683.jpg',
  },
  {
    active: false,
    buttonText: 'Get your bonus today',
    id: '9ea0cbe6-0223-4207-a17f-5890330b6889',
    scope: 'BRAND',
    scopeId: '5223e12b-644c-411c-aebe-f924253c9da3',
    subtitle: undefined,
    title: 'Give your car the best treat 2',
    type: 'HOME',
    url: '/login',
    validFrom: new Date('2023-12-05T23:00:00Z'),
    validTo: new Date('2023-12-14T23:00:00Z'),
    version: 1,
    image:
      'https://www.sixt.com/magazine/wp-content/uploads//sites/6/2022/04/Bugatti-Bolide-Hypercar-resize-1024x683.jpg',
  },
  {
    active: false,
    buttonText: 'Get your bonus today',
    id: '9ea0cbe6-0223-4207-a17f-5890330b6889',
    scope: 'BRAND',
    scopeId: '5223e12b-644c-411c-aebe-f924253c9da3',
    subtitle: undefined,
    title: 'Give your car the best treat 3',
    type: 'HOME',
    url: '/login',
    validFrom: new Date('2023-12-05T23:00:00Z'),
    validTo: new Date('2023-12-14T23:00:00Z'),
    version: 1,
    image:
      'https://www.sixt.com/magazine/wp-content/uploads//sites/6/2022/04/Bugatti-Bolide-Hypercar-resize-1024x683.jpg',
  },
];
