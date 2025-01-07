import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsUnitsPartFeatureComponent } from './ms-units-part-feature.component';

describe('MsUnitsPartFeatureComponent', () => {
  let component: MsUnitsPartFeatureComponent;
  let fixture: ComponentFixture<MsUnitsPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsUnitsPartFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsUnitsPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
