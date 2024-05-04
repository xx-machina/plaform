import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationTemplate } from './donation.template';

describe('DonationTemplate', () => {
  let component: DonationTemplate;
  let fixture: ComponentFixture<DonationTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationTemplate ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
