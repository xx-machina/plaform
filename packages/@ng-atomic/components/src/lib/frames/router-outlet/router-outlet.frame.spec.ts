import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutletFrame } from './router-outlet.frame';

describe('RouterOutletFrame', () => {
  let component: RouterOutletFrame;
  let fixture: ComponentFixture<RouterOutletFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterOutletFrame ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterOutletFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
