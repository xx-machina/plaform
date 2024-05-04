import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerFrame } from './divider.frame';

describe('DividerFrame', () => {
  let component: DividerFrame;
  let fixture: ComponentFixture<DividerFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DividerFrame ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividerFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
