import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsHandComponent } from './ms-hand.component';

describe('MsHandComponent', () => {
  let component: MsHandComponent;
  let fixture: ComponentFixture<MsHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsHandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
