import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Banner } from 'src/app/core/interfaces/common.interface';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      transition('*=>*', [
          style({opacity: 0.7}),
          animate(800)
      ])
  ])
    // trigger('fadeInOut', [
    //   // transition('*=>*', [
    //   //   style({ opacity: 0 }),
    //   //   animate('0.5s 500ms', style({ opacity: 1 })),
    //   // ]),
    //   transition('*=>*', [animate(700, style({ opacity: 0.8 }))]),
    // ]),
]

})
export class BannerComponent {
  @Input() banner!: Banner;
  @Input() index!: number;
  @Input() showControls: boolean = true;
  @Output() nextBanner = new EventEmitter<void>();
  @Output() previousBanner = new EventEmitter<void>();
}
