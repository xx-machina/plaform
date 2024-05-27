import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePreviewSectionOrganism } from './image-preview-section.organism';

describe('ImagePreviewSectionOrganism', () => {
  let component: ImagePreviewSectionOrganism;
  let fixture: ComponentFixture<ImagePreviewSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePreviewSectionOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagePreviewSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
