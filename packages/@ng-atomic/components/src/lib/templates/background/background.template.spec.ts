import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundTemplate } from './background.template';

describe('BackgroundTemplate', () => {
  let component: BackgroundTemplate;
  let fixture: ComponentFixture<BackgroundTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundTemplate]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackgroundTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
