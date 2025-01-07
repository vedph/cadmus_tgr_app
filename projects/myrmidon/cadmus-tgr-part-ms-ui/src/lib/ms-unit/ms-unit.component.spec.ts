import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsUnitComponent } from './ms-unit.component';

describe('MsUnitComponent', () => {
  let component: MsUnitComponent;
  let fixture: ComponentFixture<MsUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsUnitComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
