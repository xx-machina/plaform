import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionInputSectionOrganism } from './action-input-section.organism';

describe('ActionInputSectionOrganism', () => {
  let component: ActionInputSectionOrganism;
  let fixture: ComponentFixture<ActionInputSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ActionInputSectionOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionInputSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
