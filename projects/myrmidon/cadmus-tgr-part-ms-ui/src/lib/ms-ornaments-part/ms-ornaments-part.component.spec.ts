import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsOrnamentsPartComponent } from './ms-ornaments-part.component';

describe('MsOrnamentsPartComponent', () => {
  let component: MsOrnamentsPartComponent;
  let fixture: ComponentFixture<MsOrnamentsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsOrnamentsPartComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsOrnamentsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
