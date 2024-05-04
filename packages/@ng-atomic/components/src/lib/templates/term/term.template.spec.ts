import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermTemplate } from './term.template';

describe('TermTemplate', () => {
  let component: TermTemplate;
  let fixture: ComponentFixture<TermTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermTemplate ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
