import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsSheet } from './actions.sheet';

describe('ActionsSheet', () => {
  let component: ActionsSheet;
  let fixture: ComponentFixture<ActionsSheet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionsSheet]
    });
    fixture = TestBed.createComponent(ActionsSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
