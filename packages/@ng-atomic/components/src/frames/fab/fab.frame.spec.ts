import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabFrame } from './fab.frame';

describe('FabFrame', () => {
  let component: FabFrame;
  let fixture: ComponentFixture<FabFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FabFrame ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
