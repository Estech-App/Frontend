import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCalendarTestComponent } from './full-calendar-test.component';

describe('FullCalendarTestComponent', () => {
  let component: FullCalendarTestComponent;
  let fixture: ComponentFixture<FullCalendarTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullCalendarTestComponent]
    });
    fixture = TestBed.createComponent(FullCalendarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
