import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleFrame } from './toggle.frame';

describe('ToggleFrame', () => {
  let component: ToggleFrame;
  let fixture: ComponentFixture<ToggleFrame>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToggleFrame]
    });
    fixture = TestBed.createComponent(ToggleFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
