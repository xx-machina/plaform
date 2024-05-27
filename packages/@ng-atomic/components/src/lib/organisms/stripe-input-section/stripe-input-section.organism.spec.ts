import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeInputSectionOrganism } from './stripe-input-section.organism';

describe('StripeInputSectionOrganism', () => {
  let component: StripeInputSectionOrganism;
  let fixture: ComponentFixture<StripeInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeInputSectionOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StripeInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
