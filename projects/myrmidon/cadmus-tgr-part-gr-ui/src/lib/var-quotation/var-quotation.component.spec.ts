import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarQuotationComponent } from './var-quotation.component';

describe('VarQuotationEntryComponent', () => {
  let component: VarQuotationComponent;
  let fixture: ComponentFixture<VarQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarQuotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
