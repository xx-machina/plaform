import { NxModule } from '../nx-module';
import { Injectable, InjectionToken } from '@nx-ddd/injection-js';
import 'reflect-metadata';

export const EXAMPLE_VALUE = new InjectionToken('examole value');


@Injectable()
export abstract class Repository {
  abstract name: string;
}

@Injectable()
export class RepositoryImpl {
  name = 'RepositoryImpl.name';
}

@Injectable()
export class AppService {
  constructor(public repository: Repository) { }
}

@NxModule({
  imports: [],
  providers: [{ provide: EXAMPLE_VALUE, useValue: 'featureValue'}],
})
export class FeatureModule { }

@NxModule({
  imports: [
    FeatureModule,
  ],
  providers: []
})
export class LibraryModule {
  static forRoot() {
    return {
      nxModule: LibraryModule,
      providers: [
        {provide: EXAMPLE_VALUE, useValue: 'rootValue'},
      ],
    }
  }
}

@NxModule({
  imports: [
    LibraryModule.forRoot(),
  ],
  providers: [
    AppService,
    { provide: Repository, useClass: RepositoryImpl},
  ]
})
export class AppModule { }
