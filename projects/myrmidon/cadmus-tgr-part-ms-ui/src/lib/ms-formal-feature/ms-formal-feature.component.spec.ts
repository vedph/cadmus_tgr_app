import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsFormalFeatureComponent } from './ms-formal-feature.component';

describe('MsFormalFeatureComponent', () => {
  let component: MsFormalFeatureComponent;
  let fixture: ComponentFixture<MsFormalFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsFormalFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsFormalFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
