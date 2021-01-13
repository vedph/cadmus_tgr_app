import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableWitnessesPartFeatureComponent } from './available-witnesses-part-feature.component';

describe('AvailableWitnessesPartFeatureComponent', () => {
  let component: AvailableWitnessesPartFeatureComponent;
  let fixture: ComponentFixture<AvailableWitnessesPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableWitnessesPartFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableWitnessesPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
