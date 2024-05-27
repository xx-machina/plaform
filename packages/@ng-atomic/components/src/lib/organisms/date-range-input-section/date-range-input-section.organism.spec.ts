import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeInputSectionOrganism } from './date-range-input-section.organism';

describe('DateRangeInputSectionOrganism', () => {
  let component: DateRangeInputSectionOrganism;
  let fixture: ComponentFixture<DateRangeInputSectionOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DateRangeInputSectionOrganism]
    });
    fixture = TestBed.createComponent(DateRangeInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
