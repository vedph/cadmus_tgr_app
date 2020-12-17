import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsContentsPartFeatureComponent } from './ms-contents-part-feature.component';

describe('MsContentsPartFeatureComponent', () => {
  let component: MsContentsPartFeatureComponent;
  let fixture: ComponentFixture<MsContentsPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsContentsPartFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsContentsPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
