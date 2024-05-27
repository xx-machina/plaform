import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsFrame } from './columns.frame';

describe('ColumnsFrame', () => {
  let component: ColumnsFrame;
  let fixture: ComponentFixture<ColumnsFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsFrame]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColumnsFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
