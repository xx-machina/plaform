import { NgModule } from "@angular/core";
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SheetService } from "./sheets.service";

@NgModule({
  imports: [
    MatBottomSheetModule
  ],
  providers: [SheetService]
})
export class NgAtomicSheetsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicSheetsModule,
      providers: [

      ],
    };
  }
}