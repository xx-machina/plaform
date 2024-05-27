import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IconAtom } from '@ng-atomic/components/atoms/icon';
import { Actions, NgAtomicComponent } from '@ng-atomic/core';
interface Settings {
  
}

enum ActionId {
  ITEM_CLICK = '[@ng-atomic/components/templates/settings] item click',
  REMOVE_SERVICE_WORKER = '[@ng-atomic/components/templates/settings] remove service worker',
}

@Component({
  selector: 'templates-settings',
  standalone: true,
  imports: [
    ScrollFrame,
    NavigatorOrganism,
    MatListModule,
    MatSlideToggleModule,
    IconAtom,
  ],
  template: `
  <frames-scroll>
    <organisms-navigator
      [startActions]="navStartActions()"
      (action)="dispatch($event)"
      navigator
    >
      {{ title() }}
    </organisms-navigator>
    <div contents>
    <mat-action-list>
      <!-- <mat-list-item role="listitem" (click)="onItemClick('payment-method')">
        <span matListItemTitle>支払い方法</span>
        <atoms-icon matListItemMeta [name]="'chevron_right'" />
      </mat-list-item> -->
      <mat-list-item role="listitem" (click)="onItemClick('payments')">
        <span matListItemTitle>支払い履歴</span>
        <atoms-icon matListItemMeta [name]="'chevron_right'" />
      </mat-list-item>
      <mat-list-item role="listitem" (click)="onServiceWorkerRemoved()">Service Workerの登録解除</mat-list-item>
    </mat-action-list>
    <mat-list role="list">
      <mat-list-item role="listitem">
        <atoms-icon matListItemIcon [name]="'notifications'" />
        <span matListItemTitle>通知の有効化</span>
        <span matListItemLine>アプリアイコンにバッジが付きます</span>
        <div matListItemMeta style="display: flex; height: 100%; align-items: center">
          <mat-slide-toggle
            class="example-margin"
            [color]="'accent'"
            [checked]="true"
            [disabled]="false"
          />
        </div>
      </mat-list-item>
    </mat-list>
    </div>
  </frames-scroll>`,
  styleUrl: './settings.template.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'template'
  }
})
export class SettingsTemplate extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  readonly title = input('title');
  readonly navStartActions = input<Actions>([]);

  protected onItemClick(payload: string) {
    this.dispatch({id: ActionId.ITEM_CLICK, payload});
  }

  protected onServiceWorkerRemoved() {
    this.dispatch({id: ActionId.REMOVE_SERVICE_WORKER});
  }
}
