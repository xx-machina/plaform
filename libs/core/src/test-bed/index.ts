import { createNxModuleRef, NxModule, NxModuleRef } from "../nx-module";

export class TestBed {
  static _INSTANCE: TestBed;

  static get INSTANCE(): TestBed {
    return this._INSTANCE ??= new this();
  }

  private moduleRef: NxModuleRef;

  configureTestingModule(nxModule: NxModule): this {
    @NxModule(nxModule) class Module { }
    this.moduleRef = createNxModuleRef(Module);
    return this;
  }

  inject(token: any) {
    return this.moduleRef.injector.get(token);
  }

  static inject(token: any) {
    return this.INSTANCE.inject(token);
  }

  static configureTestingModule(nxModule: NxModule): TestBed {
    return this.INSTANCE.configureTestingModule(nxModule);
  }
}