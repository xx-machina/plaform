import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabEditorTemplate } from './tab-editor.template';

describe('TabEditorTemplate', () => {
  let component: TabEditorTemplate;
  let fixture: ComponentFixture<TabEditorTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TabEditorTemplate ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabEditorTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
