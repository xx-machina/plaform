import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHeaderOrganism } from './menu-header.organism';

describe('MenuHeaderOrganism', () => {
  let component: MenuHeaderOrganism;
  let fixture: ComponentFixture<MenuHeaderOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuHeaderOrganism]
    });
    fixture = TestBed.createComponent(MenuHeaderOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
