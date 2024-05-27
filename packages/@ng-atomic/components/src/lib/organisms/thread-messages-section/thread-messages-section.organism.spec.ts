import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadMessagesSectionOrganism } from './thread-messages-section.organism';

describe('ThreadMessagesSectionOrganism', () => {
  let component: ThreadMessagesSectionOrganism;
  let fixture: ComponentFixture<ThreadMessagesSectionOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ThreadMessagesSectionOrganism]
    });
    fixture = TestBed.createComponent(ThreadMessagesSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
