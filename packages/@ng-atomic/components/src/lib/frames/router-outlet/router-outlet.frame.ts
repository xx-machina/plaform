import { ChangeDetectionStrategy, Component, Input, Pipe, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayFrame } from '@ng-atomic/components/frames/overlay';
import { LineUpFrame } from '@ng-atomic/components/frames/line-up';
import { RouterOutlet } from '@angular/router';
import { SignalPipe, signalize } from '@ng-atomic/common/pipes/signal';
import { injectUiConfig } from '@ng-atomic/common/services/ui';

@Pipe({
  name: 'isBlankRoute',
  standalone: true,
  pure: false,
})
export class IsBlankRoutePipe {
  transform(outlet: RouterOutlet): boolean {
    return !!(outlet?.activatedRouteData) && !(outlet.activatedRouteData?.['isBlank']);
  }
}

@Component({
  selector: 'frames-router-outlet',
  standalone: true,
  imports: [
    CommonModule,
    OverlayFrame,
    LineUpFrame,
    RouterOutlet,
    IsBlankRoutePipe,
    SignalPipe,
  ],
  template: `
    <ng-container [ngSwitch]="frame()">
      <frames-overlay *ngSwitchCase="'overlay'" [hasNext]="outlet | isBlankRoute">
        <ng-container main *ngTemplateOutlet="main"></ng-container>
        <ng-container next *ngTemplateOutlet="next"></ng-container>
      </frames-overlay>
      <frames-line-up *ngSwitchCase="'lineup'" [hasNext]="outlet | isBlankRoute">
        <ng-container main *ngTemplateOutlet="main"></ng-container>
        <ng-container next *ngTemplateOutlet="next"></ng-container>
      </frames-line-up>
    </ng-container>

    <ng-template #main><ng-content main></ng-content></ng-template>
    <ng-template #next><router-outlet></router-outlet></ng-template>
  `,
  styleUrls: ['./router-outlet.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouterOutletFrame {

  @ViewChild(RouterOutlet, {static: false})
  outlet!: RouterOutlet;

  @Input({transform: (v: any) => signalize(v)})
  frame = injectUiConfig(['frames', 'router', 'type']);

}
