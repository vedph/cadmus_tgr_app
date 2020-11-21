import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LingTaggedFormComponent } from './ling-tagged-form.component';

describe('LingTaggedFormComponent', () => {
  let component: LingTaggedFormComponent;
  let fixture: ComponentFixture<LingTaggedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LingTaggedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LingTaggedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
