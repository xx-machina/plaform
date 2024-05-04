import { createNxModuleRef } from "@nx-ddd/core/nx-module";
import { UsecaseModule } from './usecase.module';
import { UsecaseService } from "./usecase.service";

describe('UsecaseService', () => {
  const { injector } = createNxModuleRef(UsecaseModule);
  const service = injector.get(UsecaseService);

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
