import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalDividerOrganism } from './vertical-divider.organism';

describe('VerticalDividerOrganism', () => {
  let component: VerticalDividerOrganism;
  let fixture: ComponentFixture<VerticalDividerOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VerticalDividerOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalDividerOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
