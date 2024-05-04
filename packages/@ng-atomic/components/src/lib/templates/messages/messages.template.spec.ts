import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTemplate } from './messages.template';

describe('MessagesTemplate', () => {
  let component: MessagesTemplate;
  let fixture: ComponentFixture<MessagesTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MessagesTemplate ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
