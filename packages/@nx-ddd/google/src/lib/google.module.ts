import { NgModule } from '@angular/core';
import { GOOGLE_CONFIG, GoogleConfig } from './google.config';
import { GoogleService } from './google.service';
import { GoogleServiceImpl } from './google.service.impl';

@NgModule({})
export class GoogleModule {
  static forRoot(config: GoogleConfig) {
    return {
      ngModule: GoogleModule,
      providers: [
        { provide: GOOGLE_CONFIG, useValue: config },
        { provide: GoogleService, useClass: GoogleServiceImpl },
      ],
    };
  }
}
