import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPalimpsestComponent } from './ms-palimpsest.component';

describe('MsPalimpsestComponent', () => {
  let component: MsPalimpsestComponent;
  let fixture: ComponentFixture<MsPalimpsestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsPalimpsestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsPalimpsestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
