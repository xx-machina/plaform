import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarOrganism } from './toolbar.organism';

describe('ToolbarOrganism', () => {
  let component: ToolbarOrganism;
  let fixture: ComponentFixture<ToolbarOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ToolbarOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
