import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBoxMolecule } from './loading-box.molecule';

describe('LoadingBoxMolecule', () => {
  let component: LoadingBoxMolecule;
  let fixture: ComponentFixture<LoadingBoxMolecule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingBoxMolecule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingBoxMolecule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
