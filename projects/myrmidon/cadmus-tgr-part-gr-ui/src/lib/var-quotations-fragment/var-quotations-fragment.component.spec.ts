import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarQuotationsFragmentComponent } from './var-quotations-fragment.component';

describe('VarQuotationsFragmentComponent', () => {
  let component: VarQuotationsFragmentComponent;
  let fixture: ComponentFixture<VarQuotationsFragmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarQuotationsFragmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarQuotationsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
