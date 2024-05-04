import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MermaidSectionOrganism } from './mermaid-section.organism';

describe('MermaidSectionOrganism', () => {
  let component: MermaidSectionOrganism;
  let fixture: ComponentFixture<MermaidSectionOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MermaidSectionOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MermaidSectionOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
