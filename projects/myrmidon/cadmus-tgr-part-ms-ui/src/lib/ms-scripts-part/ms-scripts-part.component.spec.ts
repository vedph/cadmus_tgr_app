import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsScriptsPartComponent } from './ms-scripts-part.component';

describe('MsScriptsPartComponent', () => {
  let component: MsScriptsPartComponent;
  let fixture: ComponentFixture<MsScriptsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsScriptsPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsScriptsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
