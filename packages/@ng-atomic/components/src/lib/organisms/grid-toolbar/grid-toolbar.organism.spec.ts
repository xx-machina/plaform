import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridToolbarOrganism } from './grid-toolbar.organism';

describe('GridToolbarOrganism', () => {
  let component: GridToolbarOrganism;
  let fixture: ComponentFixture<GridToolbarOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GridToolbarOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridToolbarOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
