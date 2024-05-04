import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTemplate } from './selection.template';

describe('SelectionTemplate', () => {
  let component: SelectionTemplate;
  let fixture: ComponentFixture<SelectionTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SelectionTemplate ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
