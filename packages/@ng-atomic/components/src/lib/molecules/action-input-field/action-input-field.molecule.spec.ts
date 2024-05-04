import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionInputFieldMolecule } from './action-input-field.molecule';

describe('ActionInputFieldMolecule', () => {
  let component: ActionInputFieldMolecule;
  let fixture: ComponentFixture<ActionInputFieldMolecule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ActionInputFieldMolecule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionInputFieldMolecule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
