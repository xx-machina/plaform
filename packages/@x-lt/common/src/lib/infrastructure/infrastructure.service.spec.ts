import { TestBed } from "@nx-ddd/core/test-bed";
import { DISCORD_ACCESS_TOKEN, DISCORD_CONFIG } from "./external/discord";
import { InfrastructureModule } from "./infrastructure.module";
import { InfrastructureService } from "./infrastructure.service";

describe('InfrastructureService', () => {
  let service: InfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InfrastructureModule
      ],
      providers: [
        { provide: DISCORD_CONFIG, useValue: {} },
        { provide: DISCORD_ACCESS_TOKEN, useValue: '' },
      ]
    });
    service = TestBed.inject(InfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
