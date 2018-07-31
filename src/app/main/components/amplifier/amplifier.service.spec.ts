import { TestBed, inject } from '@angular/core/testing';

import { AmplifierService } from './amplifier.service';

describe('AmplifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AmplifierService ]
    });
  });

  it('should be created', inject([ AmplifierService ], (service: AmplifierService ) => {
    expect(service).toBeTruthy();
  }));
});
