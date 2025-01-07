import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPlaceComponent } from './ms-place.component';

describe('MsPlaceComponent', () => {
  let component: MsPlaceComponent;
  let fixture: ComponentFixture<MsPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsPlaceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
