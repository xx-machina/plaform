import { createNxModuleRef } from "@nx-ddd/core/nx-module";

describe('BankAccountService', () => {
  const { injector } = createNxModuleRef(BankAccountModule);

  it('should be created', () => {
    expect(injector).toBeTruthy();
  });
});
