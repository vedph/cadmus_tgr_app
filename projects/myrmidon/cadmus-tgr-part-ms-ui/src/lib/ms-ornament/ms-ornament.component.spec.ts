import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsOrnamentComponent } from './ms-ornament.component';

describe('MsOrnamentComponent', () => {
  let component: MsOrnamentComponent;
  let fixture: ComponentFixture<MsOrnamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsOrnamentComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsOrnamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
