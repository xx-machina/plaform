import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizationInterceptor, PROVIDE_AUTHORIZATION } from '@ng-atomic/common/interceptors/authorization';
import { ThrottleInterceptor } from '@ng-atomic/common/interceptors/throttle';
import { AuthService } from '@ng-atomic/common/services/auth';
import { map, of, switchMap } from 'rxjs';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ThrottleInterceptor,
      multi: true
    },
    {
      provide: PROVIDE_AUTHORIZATION,
      useValue: () => inject(AuthService).auth$.pipe(
        switchMap(auth => auth ? auth.getIdToken() : of(``)),
        map(token => `Bearer ${token}`),
      ),
    },
  ],
})
export class InterceptorsModule { }
