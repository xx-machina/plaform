import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { NgAtomicComponent } from '@ng-atomic/core';
import { FallbackSrcDirective } from '@ng-atomic/common/directives/fallback-src';

enum ActionId {
  ITEM_CLICK = '[@ng-atomic/components/organisms/grid-cards-section] Item Click',
}

@Component({
  selector: 'molecules-grid-item',
  standalone: true,
  imports: [
    DataAccessorPipe,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    FallbackSrcDirective,
  ],
  template: `
  <div class="content" matRipple>
    <button mat-icon-button color="primary" (click)="onItemMenuClick(item(), $event)">
      <mat-icon>menu</mat-icon>
    </button>
    <div class="eye-catch">
      <img fallbackSrc [src]="item() | dataAccessor:'imgUrl'" alt="サムネイル画像">
      <div class="label">{{ item() | dataAccessor:'label' }}</div>
    </div>
    <div class="meta">
      <div class="title">{{ item() | dataAccessor:'title' }}</div>
      <div class="description"><span>{{ item() | dataAccessor:'description' }}</span></div>
      <div class="sub"><span>{{ item() | dataAccessor:'sub' }}</span></div>
    </div>
  </div>
  `,
  styleUrl: './grid-item.molecule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridItemMolecule<T> extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  readonly item = input<T>();

  protected onItemMenuClick(item: T, $event: Event) {
    $event.stopPropagation();
  }
}
