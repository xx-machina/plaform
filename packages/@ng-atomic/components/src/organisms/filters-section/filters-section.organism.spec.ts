import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersSectionOrganism } from './filters-section.organism';

describe('FiltersSectionOrganism', () => {
  let component: FiltersSectionOrganism;
  let fixture: ComponentFixture<FiltersSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FiltersSectionOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
