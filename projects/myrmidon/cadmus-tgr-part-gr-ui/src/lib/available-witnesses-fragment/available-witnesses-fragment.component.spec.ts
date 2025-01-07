import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableWitnessesFragmentComponent } from './available-witnesses-fragment.component';

describe('AvailableWitnessesFragmentComponent', () => {
  let component: AvailableWitnessesFragmentComponent;
  let fixture: ComponentFixture<AvailableWitnessesFragmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AvailableWitnessesFragmentComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableWitnessesFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
