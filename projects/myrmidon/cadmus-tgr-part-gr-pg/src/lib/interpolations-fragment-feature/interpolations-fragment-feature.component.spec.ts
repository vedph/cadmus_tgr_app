import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpolationsFragmentFeatureComponent } from './interpolations-fragment-feature.component';

describe('InterpolationsFragmentFeatureComponent', () => {
  let component: InterpolationsFragmentFeatureComponent;
  let fixture: ComponentFixture<InterpolationsFragmentFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterpolationsFragmentFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpolationsFragmentFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
