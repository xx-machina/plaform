import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputSectionOrganism } from './file-input-section.organism';

describe('FileInputSectionOrganism', () => {
  let component: FileInputSectionOrganism;
  let fixture: ComponentFixture<FileInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FileInputSectionOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
