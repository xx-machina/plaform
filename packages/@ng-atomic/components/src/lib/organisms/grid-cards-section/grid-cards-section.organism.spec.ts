import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCardsSectionOrganism } from './grid-cards-section.organism';

describe('GridCardsSectionOrganism', () => {
  let component: GridCardsSectionOrganism;
  let fixture: ComponentFixture<GridCardsSectionOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GridCardsSectionOrganism]
    });
    fixture = TestBed.createComponent(GridCardsSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
