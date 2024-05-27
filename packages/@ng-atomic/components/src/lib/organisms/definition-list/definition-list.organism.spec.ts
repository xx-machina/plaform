import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionListOrganism } from './definition-list.organism';

describe('DefinitionListOrganism', () => {
  let component: DefinitionListOrganism;
  let fixture: ComponentFixture<DefinitionListOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinitionListOrganism]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefinitionListOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
