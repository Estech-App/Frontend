import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionMainComponent } from './direccion-main.component';

describe('DireccionMainComponent', () => {
  let component: DireccionMainComponent;
  let fixture: ComponentFixture<DireccionMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DireccionMainComponent]
    });
    fixture = TestBed.createComponent(DireccionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
