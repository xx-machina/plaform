import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFrame } from './app.frame';

describe('AppFrame', () => {
  let component: AppFrame;
  let fixture: ComponentFixture<AppFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFrame]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
