import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthHoursComponent } from './month-hours.component';

describe('MonthHoursComponent', () => {
  let component: MonthHoursComponent;
  let fixture: ComponentFixture<MonthHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthHoursComponent]
    });
    fixture = TestBed.createComponent(MonthHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
