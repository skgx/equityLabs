import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerBarComponent } from './ticker-bar.component';

describe('TickerBarComponent', () => {
  let component: TickerBarComponent;
  let fixture: ComponentFixture<TickerBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickerBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
