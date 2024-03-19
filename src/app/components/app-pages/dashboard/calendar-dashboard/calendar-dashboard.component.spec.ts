import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDashboardComponent } from './calendar-dashboard.component';

describe('CalendarDashboardComponent', () => {
  let component: CalendarDashboardComponent;
  let fixture: ComponentFixture<CalendarDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarDashboardComponent]
    });
    fixture = TestBed.createComponent(CalendarDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
