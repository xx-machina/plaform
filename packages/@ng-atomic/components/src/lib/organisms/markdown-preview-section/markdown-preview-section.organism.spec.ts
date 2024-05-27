import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownPreviewSectionOrganism } from './markdown-preview-section.organism';

describe('MarkdownPreviewSectionOrganism', () => {
  let component: MarkdownPreviewSectionOrganism;
  let fixture: ComponentFixture<MarkdownPreviewSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownPreviewSectionOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownPreviewSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
