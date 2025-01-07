import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsOrnamentsPartFeatureComponent } from './ms-ornaments-part-feature.component';

describe('MsOrnamentsPartFeatureComponent', () => {
  let component: MsOrnamentsPartFeatureComponent;
  let fixture: ComponentFixture<MsOrnamentsPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsOrnamentsPartFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsOrnamentsPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
