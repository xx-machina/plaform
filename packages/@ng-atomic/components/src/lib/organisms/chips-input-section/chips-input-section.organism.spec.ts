import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsInputSectionOrganism } from './chips-input-section.organism';

describe('ChipsInputSectionOrganism', () => {
  let component: ChipsInputSectionOrganism;
  let fixture: ComponentFixture<ChipsInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsInputSectionOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChipsInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
