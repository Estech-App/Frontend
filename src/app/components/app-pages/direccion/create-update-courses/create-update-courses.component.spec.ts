import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCoursesComponent } from './create-update-courses.component';

describe('CreateUpdateCoursesComponent', () => {
  let component: CreateUpdateCoursesComponent;
  let fixture: ComponentFixture<CreateUpdateCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateCoursesComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
