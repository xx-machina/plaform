import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeColumnMolecule } from './tree-column.molecule';

describe('TreeColumnMolecule', () => {
  let component: TreeColumnMolecule;
  let fixture: ComponentFixture<TreeColumnMolecule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TreeColumnMolecule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeColumnMolecule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
