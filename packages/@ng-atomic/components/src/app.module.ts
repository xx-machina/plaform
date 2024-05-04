// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ElementsModule, IMPORT_NG_MODULE, resolveModulePathAndName, modulePathWrapper } from '@ng-atomic/elements';
// import { QueryPipe } from './lib/query.pipe';


// @NgModule({
//   imports: [
//     BrowserModule,
//     BrowserAnimationsModule,
//   ],
//   providers: [
//     {
//       provide: IMPORT_NG_MODULE,
//       useValue: (key: string) => {
//         const [path, name] = resolveModulePathAndName(key);
//         return import(`./${modulePathWrapper(path)}.module`).then(m => m?.[name]);
//       }
//     },
//   ],
//   declarations: [
//     QueryPipe
//   ],
// })
// export class AppModule extends ElementsModule { }
