import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableWitnessesFragmentFeatureComponent } from './available-witnesses-fragment-feature.component';

describe('AvailableWitnessesFragmentFeatureComponent', () => {
  let component: AvailableWitnessesFragmentFeatureComponent;
  let fixture: ComponentFixture<AvailableWitnessesFragmentFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableWitnessesFragmentFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableWitnessesFragmentFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
