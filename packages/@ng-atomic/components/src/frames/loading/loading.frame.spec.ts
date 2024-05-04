import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingFrame } from './loading.frame';

describe('LoadingFrame', () => {
  let component: LoadingFrame;
  let fixture: ComponentFixture<LoadingFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LoadingFrame ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
