import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsScriptComponent } from './ms-script.component';

describe('MsScriptComponent', () => {
  let component: MsScriptComponent;
  let fixture: ComponentFixture<MsScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
