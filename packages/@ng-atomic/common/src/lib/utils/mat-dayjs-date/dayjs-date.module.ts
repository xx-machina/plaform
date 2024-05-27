import { NgModule, Provider } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DayjsDateAdapter, MAT_DAYJS_DATE_ADAPTER_OPTIONS } from './dayjs-date.adapter';
import { MAT_DAYJS_DATE_FORMATS } from './dayjs-date.formats';

@NgModule({
  providers: [
    provideDayjsDateAdapter(),
  ],
})
export class DayjsDateModule { }

export function provideDayjsDateAdapter(): Provider[] {
  return [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [
        MAT_DATE_LOCALE, 
        MAT_DAYJS_DATE_ADAPTER_OPTIONS,
      ]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_DAYJS_DATE_FORMATS,
    },  
  ]
}
