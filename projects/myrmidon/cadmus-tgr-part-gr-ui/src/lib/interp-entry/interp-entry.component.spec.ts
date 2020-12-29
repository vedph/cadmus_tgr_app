import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpEntryComponent } from './interp-entry.component';

describe('InterpEntryComponent', () => {
  let component: InterpEntryComponent;
  let fixture: ComponentFixture<InterpEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterpEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
