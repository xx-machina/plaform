import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputFieldMolecule } from './file-input-field.molecule';

describe('FileInputFieldMolecule', () => {
  let component: FileInputFieldMolecule;
  let fixture: ComponentFixture<FileInputFieldMolecule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FileInputFieldMolecule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileInputFieldMolecule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
