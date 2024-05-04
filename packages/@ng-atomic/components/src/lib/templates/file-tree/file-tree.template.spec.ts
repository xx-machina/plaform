import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTreeTemplate } from './file-tree.template';

describe('FileTreeTemplate', () => {
  let component: FileTreeTemplate;
  let fixture: ComponentFixture<FileTreeTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FileTreeTemplate ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileTreeTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
