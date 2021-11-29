import { TestBed } from '@angular/core/testing';

import { MsLocationService } from './ms-location.service';

describe('MsLocationService', () => {
  let service: MsLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse 36', () => {
    const l = service.parseLocation('36');
    expect(l).toBeTruthy();
    expect(l.n).toBe(36);
    expect(l.r).toBeFalse();
    expect(l.s).toBeFalsy();
    expect(l.l).toBe(0);
  });

  it('should parse 36r12', () => {
    const l = service.parseLocation('36r12');
    expect(l).toBeTruthy();
    expect(l.n).toBe(36);
    expect(l.r).toBeFalse();
    expect(l.s).toBe('r');
    expect(l.l).toBe(12);
  });

  it('should parse 36ra12', () => {
    const l = service.parseLocation('36ra12');
    expect(l).toBeTruthy();
    expect(l.n).toBe(36);
    expect(l.r).toBeFalse();
    expect(l.s).toBe('ra');
    expect(l.l).toBe(12);
  });

  it('should parse 36v12', () => {
    const l = service.parseLocation('36v12');
    expect(l).toBeTruthy();
    expect(l.n).toBe(36);
    expect(l.r).toBeFalse();
    expect(l.s).toBe('v');
    expect(l.l).toBe(12);
  });

  it('should parse 36rv12', () => {
    const l = service.parseLocation('36rv12');
    expect(l).toBeTruthy();
    expect(l.n).toBe(36);
    expect(l.r).toBeFalse();
    expect(l.s).toBe('rv');
    expect(l.l).toBe(12);
  });

  it('should parse 36r', () => {
    const l = service.parseLocation('36r');
    expect(l).toBeTruthy();
    expect(l.n).toBe(36);
    expect(l.r).toBeFalse();
    expect(l.s).toBe('r');
    expect(l.l).toBe(0);
  });

  it('should parse IVv12', () => {
    const l = service.parseLocation('IVv12');
    expect(l).toBeTruthy();
    expect(l.n).toBe(4);
    expect(l.r).toBeTrue();
    expect(l.s).toBe('v');
    expect(l.l).toBe(12);
  });
});
