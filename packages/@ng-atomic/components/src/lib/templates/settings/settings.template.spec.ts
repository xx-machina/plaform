import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTemplate } from './settings.template';

describe('SettingsTemplate', () => {
  let component: SettingsTemplate;
  let fixture: ComponentFixture<SettingsTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsTemplate]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
