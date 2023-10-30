import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMoviesTableComponent } from './top-movies-table.component';

describe('TopMoviesTableComponent', () => {
  let component: TopMoviesTableComponent;
  let fixture: ComponentFixture<TopMoviesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopMoviesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopMoviesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
