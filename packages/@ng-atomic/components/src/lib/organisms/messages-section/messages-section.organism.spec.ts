import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesSectionOrganism } from './messages-section.organism';

describe('MessagesSectionOrganism', () => {
  let component: MessagesSectionOrganism;
  let fixture: ComponentFixture<MessagesSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesSectionOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
