import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Action } from '@ng-atomic/core';

@Injectable()
export class SheetService {

  constructor(private bottomSheet: MatBottomSheet) { }

  async openActions(actions: Action[]): Promise<MatBottomSheetRef> {
    return import('@ng-atomic/components/sheets/actions').then(({ActionsSheet}) => {
      return this.bottomSheet.open(ActionsSheet, {data: actions});
    });
  }
}
