import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeFeedComponent } from './trade-feed.component';

describe('TradeFeedComponent', () => {
  let component: TradeFeedComponent;
  let fixture: ComponentFixture<TradeFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
