import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputSectionOrganism } from './password-input-section.organism';

describe('PasswordInputSectionOrganism', () => {
  let component: PasswordInputSectionOrganism;
  let fixture: ComponentFixture<PasswordInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputSectionOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
