import { TestBed } from '@angular/core/testing';

import { BucketStoreService } from './bucket-store.service';

describe('BucketStoreService', () => {
  let service: BucketStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BucketStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
