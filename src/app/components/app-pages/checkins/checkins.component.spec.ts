import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinsComponent } from './checkins.component';

describe('CheckinsComponent', () => {
  let component: CheckinsComponent;
  let fixture: ComponentFixture<CheckinsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckinsComponent]
    });
    fixture = TestBed.createComponent(CheckinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
