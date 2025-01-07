import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsHistoryPartFeatureComponent } from './ms-history-part-feature.component';

describe('MsHistoryPartFeatureComponent', () => {
  let component: MsHistoryPartFeatureComponent;
  let fixture: ComponentFixture<MsHistoryPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsHistoryPartFeatureComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsHistoryPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
