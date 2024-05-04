import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeSectionOrganism } from './tree-section.organism';

describe('TreeSectionOrganism', () => {
  let component: TreeSectionOrganism;
  let fixture: ComponentFixture<TreeSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TreeSectionOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
