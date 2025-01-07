import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPlacesPartFeatureComponent } from './ms-places-part-feature.component';

describe('MsPlacesPartFeatureComponent', () => {
  let component: MsPlacesPartFeatureComponent;
  let fixture: ComponentFixture<MsPlacesPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsPlacesPartFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsPlacesPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
