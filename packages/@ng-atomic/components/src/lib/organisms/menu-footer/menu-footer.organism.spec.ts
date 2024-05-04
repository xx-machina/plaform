import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFooterOrganism } from './menu-footer.organism';

describe('MenuFooterOrganism', () => {
  let component: MenuFooterOrganism;
  let fixture: ComponentFixture<MenuFooterOrganism>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuFooterOrganism]
    });
    fixture = TestBed.createComponent(MenuFooterOrganism);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
