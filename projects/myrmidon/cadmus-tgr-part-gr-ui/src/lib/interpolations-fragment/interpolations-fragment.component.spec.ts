import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpolationsFragmentComponent } from './interpolations-fragment.component';

describe('InterpolationsFragmentComponent', () => {
  let component: InterpolationsFragmentComponent;
  let fixture: ComponentFixture<InterpolationsFragmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InterpolationsFragmentComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpolationsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
