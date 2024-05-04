import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageInputSectionOrganism } from './message-input-section.organism';

describe('MessageInputSectionOrganism', () => {
  let component: MessageInputSectionOrganism;
  let fixture: ComponentFixture<MessageInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MessageInputSectionOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
