import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsFormalFeaturesPartComponent } from './ms-formal-features-part.component';

describe('MsFormalFeaturesPartComponent', () => {
  let component: MsFormalFeaturesPartComponent;
  let fixture: ComponentFixture<MsFormalFeaturesPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsFormalFeaturesPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsFormalFeaturesPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
