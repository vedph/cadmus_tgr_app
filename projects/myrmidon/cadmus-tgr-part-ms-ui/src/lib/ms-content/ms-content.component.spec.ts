import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsContentComponent } from './ms-content.component';

describe('MsContentComponent', () => {
  let component: MsContentComponent;
  let fixture: ComponentFixture<MsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
