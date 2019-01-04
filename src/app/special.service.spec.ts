import { TestBed, inject } from '@angular/core/testing';

import { SpecialService } from './speical.service';

describe('SpecialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialService]
    });
  });

  it('should be created', inject([SpecialService], (service: SpecialService) => {
    expect(service).toBeTruthy();
  }));
});
