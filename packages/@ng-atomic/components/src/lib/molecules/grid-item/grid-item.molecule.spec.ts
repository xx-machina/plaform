import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridItemMolecule } from './grid-item.molecule';

describe('GridItemMolecule', () => {
  let component: GridItemMolecule;
  let fixture: ComponentFixture<GridItemMolecule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridItemMolecule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridItemMolecule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
