import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonMenuTemplate } from './icon-button-menu.template';

describe('IconButtonMenuTemplate', () => {
  let component: IconButtonMenuTemplate;
  let fixture: ComponentFixture<IconButtonMenuTemplate>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconButtonMenuTemplate]
    });
    fixture = TestBed.createComponent(IconButtonMenuTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
