import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeInputFieldMolecule } from './date-range-input-field.molecule';

describe('DateRangeInputFieldMolecule', () => {
  let component: DateRangeInputFieldMolecule;
  let fixture: ComponentFixture<DateRangeInputFieldMolecule>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DateRangeInputFieldMolecule]
    });
    fixture = TestBed.createComponent(DateRangeInputFieldMolecule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
