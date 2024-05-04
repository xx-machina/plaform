import { TestBed } from "@nx-ddd/core/test-bed";
import { SecondSelectionService } from "./second-selection.service";

describe('SecondSelectionService', () => {
  let service: SecondSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecondSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
