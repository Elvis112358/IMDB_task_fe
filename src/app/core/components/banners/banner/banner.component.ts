import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Banner } from 'src/app/core/interfaces/common.interface';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  @Input() banner!: Banner;
  @Input() index!: number;
  @Input() showControls: boolean = true;
  @Output() onPageChange = new EventEmitter<number>();
}
