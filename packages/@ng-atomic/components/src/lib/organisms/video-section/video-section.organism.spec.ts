import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSectionOrganism } from './video-section.organism';

describe('VideoSectionOrganism', () => {
  let component: VideoSectionOrganism;
  let fixture: ComponentFixture<VideoSectionOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VideoSectionOrganism]
    });
    fixture = TestBed.createComponent(VideoSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
