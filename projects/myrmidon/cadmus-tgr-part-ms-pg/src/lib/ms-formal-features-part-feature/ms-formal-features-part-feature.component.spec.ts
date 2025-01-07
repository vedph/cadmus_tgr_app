import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsFormalFeaturesPartFeatureComponent } from './ms-formal-features-part-feature.component';

describe('MsFormalFeaturesPartFeatureComponent', () => {
  let component: MsFormalFeaturesPartFeatureComponent;
  let fixture: ComponentFixture<MsFormalFeaturesPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsFormalFeaturesPartFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsFormalFeaturesPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
