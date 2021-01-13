import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableWitnessesPartComponent } from './available-witnesses-part.component';

describe('AvailableWitnessesPartComponent', () => {
  let component: AvailableWitnessesPartComponent;
  let fixture: ComponentFixture<AvailableWitnessesPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableWitnessesPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableWitnessesPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
