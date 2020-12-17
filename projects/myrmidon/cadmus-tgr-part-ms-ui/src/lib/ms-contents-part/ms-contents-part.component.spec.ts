import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsContentsPartComponent } from './ms-contents-part.component';

describe('MsContentsPartComponent', () => {
  let component: MsContentsPartComponent;
  let fixture: ComponentFixture<MsContentsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsContentsPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsContentsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
