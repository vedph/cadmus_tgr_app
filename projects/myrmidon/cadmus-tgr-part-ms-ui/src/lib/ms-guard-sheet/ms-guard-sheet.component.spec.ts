import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsGuardSheetComponent } from './ms-guard-sheet.component';

describe('MsGuardSheetComponent', () => {
  let component: MsGuardSheetComponent;
  let fixture: ComponentFixture<MsGuardSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsGuardSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsGuardSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
