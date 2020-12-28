import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarQuotationEntryComponent } from './var-quotation-entry.component';

describe('VarQuotationEntryComponent', () => {
  let component: VarQuotationEntryComponent;
  let fixture: ComponentFixture<VarQuotationEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarQuotationEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarQuotationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
