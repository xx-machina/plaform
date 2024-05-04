import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorTemplate } from './code-editor.template';

describe('CodeEditorTemplate', () => {
  let component: CodeEditorTemplate;
  let fixture: ComponentFixture<CodeEditorTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CodeEditorTemplate ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeEditorTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
