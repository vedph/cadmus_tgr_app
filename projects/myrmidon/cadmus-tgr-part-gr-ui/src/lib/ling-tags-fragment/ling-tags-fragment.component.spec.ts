import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LingTagsFragmentComponent } from './ling-tags-fragment.component';

describe('LingTagsFragmentComponent', () => {
  let component: LingTagsFragmentComponent;
  let fixture: ComponentFixture<LingTagsFragmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LingTagsFragmentComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LingTagsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
