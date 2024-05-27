import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPreviewSectionOrganism } from './text-preview-section.organism';

describe('TextPreviewSectionOrganism', () => {
  let component: TextPreviewSectionOrganism;
  let fixture: ComponentFixture<TextPreviewSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextPreviewSectionOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextPreviewSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
