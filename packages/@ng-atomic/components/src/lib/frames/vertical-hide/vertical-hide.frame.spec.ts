import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalHideFrame } from './vertical-hide.frame';

describe('VerticalHideFrame', () => {
  let component: VerticalHideFrame;
  let fixture: ComponentFixture<VerticalHideFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VerticalHideFrame ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalHideFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
