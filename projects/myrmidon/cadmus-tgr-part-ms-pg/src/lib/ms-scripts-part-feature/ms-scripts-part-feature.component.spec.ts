import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsScriptsPartFeatureComponent } from './ms-scripts-part-feature.component';

describe('MsScriptsPartFeatureComponent', () => {
  let component: MsScriptsPartFeatureComponent;
  let fixture: ComponentFixture<MsScriptsPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsScriptsPartFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsScriptsPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
