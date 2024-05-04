import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalOrganism } from './terminal.organism';

describe('TerminalOrganism', () => {
  let component: TerminalOrganism;
  let fixture: ComponentFixture<TerminalOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TerminalOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
