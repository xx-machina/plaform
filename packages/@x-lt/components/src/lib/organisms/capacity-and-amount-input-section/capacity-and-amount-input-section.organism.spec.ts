import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityAndAmountInputSectionOrganism } from './capacity-and-amount-input-section.organism';

describe('CapacityAndAmountInputSectionOrganism', () => {
  let component: CapacityAndAmountInputSectionOrganism;
  let fixture: ComponentFixture<CapacityAndAmountInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacityAndAmountInputSectionOrganism ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityAndAmountInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
