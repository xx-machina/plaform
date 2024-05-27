import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementInputSectionOrganism } from './agreement-input-section.organism';

describe('AgreementInputSectionOrganism', () => {
  let component: AgreementInputSectionOrganism;
  let fixture: ComponentFixture<AgreementInputSectionOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgreementInputSectionOrganism]
    });
    fixture = TestBed.createComponent(AgreementInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
