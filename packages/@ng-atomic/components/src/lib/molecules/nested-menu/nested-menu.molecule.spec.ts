import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedMenuMolecule } from './nested-menu.molecule';

describe('NestedMenuMolecule', () => {
  let component: NestedMenuMolecule;
  let fixture: ComponentFixture<NestedMenuMolecule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NestedMenuMolecule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedMenuMolecule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
