import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.scss']
})

export class RatingStarComponent {
  @Input() rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5]; // Number of stars
  onStarsClick(intStars: number): void {
    console.log('inStars', intStars + 5);
  }
}