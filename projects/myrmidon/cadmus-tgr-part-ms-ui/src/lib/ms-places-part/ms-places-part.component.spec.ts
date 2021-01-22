import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPlacesPartComponent } from './ms-places-part.component';

describe('MsPlacesPartComponent', () => {
  let component: MsPlacesPartComponent;
  let fixture: ComponentFixture<MsPlacesPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsPlacesPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsPlacesPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
