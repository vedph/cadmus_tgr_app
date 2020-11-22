import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LingTagsFragmentFeatureComponent } from './ling-tags-fragment-feature.component';

describe('LingTagsFragmentFeatureComponent', () => {
  let component: LingTagsFragmentFeatureComponent;
  let fixture: ComponentFixture<LingTagsFragmentFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LingTagsFragmentFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LingTagsFragmentFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
