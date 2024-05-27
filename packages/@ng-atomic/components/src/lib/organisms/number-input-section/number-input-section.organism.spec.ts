import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInputSectionOrganism } from './number-input-section.organism';

describe('NumberInputSectionOrganism', () => {
  let component: NumberInputSectionOrganism;
  let fixture: ComponentFixture<NumberInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputSectionOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumberInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
