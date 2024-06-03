import { TestBed } from '@angular/core/testing';

import { FreeUsageService } from './free-usage.service';

describe('FreeUsageService', () => {
  let service: FreeUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
