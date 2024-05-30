import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsDetailsComponent } from './groups-details.component';

describe('GroupsDetailsComponent', () => {
  let component: GroupsDetailsComponent;
  let fixture: ComponentFixture<GroupsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupsDetailsComponent]
    });
    fixture = TestBed.createComponent(GroupsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
