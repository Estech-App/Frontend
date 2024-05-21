import { TestBed } from '@angular/core/testing';

import { MentoringService } from './mentoring.service';

describe('MentoringService', () => {
  let service: MentoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
