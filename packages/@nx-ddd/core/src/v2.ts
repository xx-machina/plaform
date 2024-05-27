import '@angular/compiler';
import { EnvironmentProviders, Injectable, Injector, NgModule, Provider, StaticProvider, Type, inject } from '@angular/core';
import { ServerModule, platformServer } from '@angular/platform-server';

@Injectable({providedIn: 'root'})
export class ExampleService {
  hello() {
    console.debug('hello');
  }
}

@NgModule({ imports: [ServerModule] })
export class CommonModule {
  service = inject(ExampleService);

  ngDoBootstrap() {
    this.service.hello();
  }
}

export async function bootstrapServer(
  moduleType: Type<any>,
  providers: StaticProvider[] = []
) {
  return platformServer(providers).bootstrapModule(moduleType, {ngZone: 'noop'});
}


export function bootstrap(providers: Array<Provider | EnvironmentProviders> = []): Promise<Injector> {
  return ngBootstrap(providers);
}

export function ngBootstrap(providers: Array<Provider | EnvironmentProviders> = []): Promise<Injector> {
  return new Promise((resolve) => {

    @NgModule({
      imports: [
        ServerModule,
      ],
      providers: providers as never as Provider[],
    })
    class AppModule {
      readonly injector = inject(Injector);
    
      async ngDoBootstrap(): Promise<void> {
        resolve(this.injector);
      }
    }

    bootstrapServer(AppModule);
  });
}

