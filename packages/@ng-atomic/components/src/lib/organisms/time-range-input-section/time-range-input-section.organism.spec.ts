import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeInputSectionOrganism } from './time-range-input-section.organism';

describe('TimeRangeInputSectionOrganism', () => {
  let component: TimeRangeInputSectionOrganism;
  let fixture: ComponentFixture<TimeRangeInputSectionOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimeRangeInputSectionOrganism]
    });
    fixture = TestBed.createComponent(TimeRangeInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
