import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsUnitsPartComponent } from './ms-units-part.component';

describe('MsUnitsPartComponent', () => {
  let component: MsUnitsPartComponent;
  let fixture: ComponentFixture<MsUnitsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsUnitsPartComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsUnitsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
