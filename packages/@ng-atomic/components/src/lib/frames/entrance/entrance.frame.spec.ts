import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceFrame } from './entrance.frame';

describe('EntranceFrame', () => {
  let component: EntranceFrame;
  let fixture: ComponentFixture<EntranceFrame>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntranceFrame]
    });
    fixture = TestBed.createComponent(EntranceFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
