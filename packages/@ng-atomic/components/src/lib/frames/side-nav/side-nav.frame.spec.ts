import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavFrame } from './side-nav.frame';

describe('SideNavFrame', () => {
  let component: SideNavFrame;
  let fixture: ComponentFixture<SideNavFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SideNavFrame ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
