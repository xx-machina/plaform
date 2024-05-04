import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionListOrganism } from './selection-list.organism';

describe('SelectionListOrganism', () => {
  let component: SelectionListOrganism;
  let fixture: ComponentFixture<SelectionListOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SelectionListOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionListOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
