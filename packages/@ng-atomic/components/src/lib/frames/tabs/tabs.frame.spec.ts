import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsFrame } from './tabs.frame';

describe('TabsFrame', () => {
  let component: TabsFrame;
  let fixture: ComponentFixture<TabsFrame>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsFrame]
    });
    fixture = TestBed.createComponent(TabsFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
