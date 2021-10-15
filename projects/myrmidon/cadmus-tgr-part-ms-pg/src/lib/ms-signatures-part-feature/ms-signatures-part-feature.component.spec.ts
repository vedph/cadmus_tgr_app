import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsSignaturesPartFeatureComponent } from './ms-signatures-part-feature.component';

describe('MsSignaturesPartFeatureComponent', () => {
  let component: MsSignaturesPartFeatureComponent;
  let fixture: ComponentFixture<MsSignaturesPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsSignaturesPartFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsSignaturesPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
