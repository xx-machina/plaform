import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexTemplate } from './index.template';

describe('IndexTemplate', () => {
  let component: IndexTemplate;
  let fixture: ComponentFixture<IndexTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexTemplate]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndexTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
