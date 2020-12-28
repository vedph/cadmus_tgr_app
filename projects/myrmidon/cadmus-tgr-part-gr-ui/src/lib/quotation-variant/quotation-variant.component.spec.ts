import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationVariantComponent } from './quotation-variant.component';

describe('QuotationVariantComponent', () => {
  let component: QuotationVariantComponent;
  let fixture: ComponentFixture<QuotationVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
