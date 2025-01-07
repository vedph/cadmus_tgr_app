import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarQuotationsFragmentFeatureComponent } from './var-quotations-fragment-feature.component';

describe('VarQuotationsFragmentFeatureComponent', () => {
  let component: VarQuotationsFragmentFeatureComponent;
  let fixture: ComponentFixture<VarQuotationsFragmentFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VarQuotationsFragmentFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarQuotationsFragmentFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
