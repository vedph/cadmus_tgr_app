import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsHistoryPartComponent } from './ms-history-part.component';

describe('MsHistoryPartComponent', () => {
  let component: MsHistoryPartComponent;
  let fixture: ComponentFixture<MsHistoryPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsHistoryPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsHistoryPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
