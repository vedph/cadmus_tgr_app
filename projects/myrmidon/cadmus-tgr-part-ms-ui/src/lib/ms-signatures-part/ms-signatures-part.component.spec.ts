import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsSignaturesPartComponent } from './ms-signatures-part.component';

describe('MsSignaturesPartComponent', () => {
  let component: MsSignaturesPartComponent;
  let fixture: ComponentFixture<MsSignaturesPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsSignaturesPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsSignaturesPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
