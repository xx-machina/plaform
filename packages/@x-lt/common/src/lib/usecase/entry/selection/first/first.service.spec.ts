import { TestBed } from "@nx-ddd/core";
import { FirstSelectionService } from "./first-selection.service";

describe('FirstSelectionService', () => {
  let service: FirstSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
}); 