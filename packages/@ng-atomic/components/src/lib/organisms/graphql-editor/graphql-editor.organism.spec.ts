import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphqlEditorOrganism } from './graphql-editor.organism';

describe('GraphqlEditorOrganism', () => {
  let component: GraphqlEditorOrganism;
  let fixture: ComponentFixture<GraphqlEditorOrganism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphqlEditorOrganism ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphqlEditorOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
