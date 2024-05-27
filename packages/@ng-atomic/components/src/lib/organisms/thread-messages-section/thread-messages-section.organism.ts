import { ChangeDetectionStrategy, Component, Directive, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actions, NgAtomicComponent } from '@ng-atomic/core';
import { MatDividerModule } from '@angular/material/divider';
import { FallbackSrcDirective } from '@ng-atomic/common/directives/fallback-src';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { MatButtonModule } from '@angular/material/button';
import { ActionsPipe } from '@ng-atomic/common/pipes/actions';

@Directive({ standalone: true })
export class ThreadMessagesSectionOrganismStore<T> {
  readonly comments = input<T[]>([]);
  readonly noCommentMessage = input('まだコメントはありません。');
  readonly commentActions = input<Actions>([]);
}

@Component({
  selector: 'organisms-thread-section',
  standalone: true,
  imports: [
    CommonModule,
    ActionsPipe,
    MatButtonModule,
    DataAccessorPipe,
    MatDividerModule,
    FallbackSrcDirective,
  ],
  template: `
  @if (store.comments()?.length === 0) {
    <div class="message">
      <div class="content">
        <span>{{ store.noCommentMessage() }}</span>
      </div>
    </div>
  }

  @for (comment of store.comments() ?? []; track comment) {
    <div class="message">
      <div class="header">
        <img [src]="comment | dataAccessor:'iconUrl'" fallbackSrc alt="">
        <div>
          <span class="name">{{ comment | dataAccessor:'authorName' }}</span>
          <div class="description">
            <span>{{ comment | dataAccessor:'description' }}</span>
          </div>
        </div>
      </div>
      <div class="content">
        <span>{{ comment | dataAccessor:'content' }}</span>
      </div>
      <div class="bottom actions">
        @for (action of store.commentActions() | resolveActions:comment; track action.id) {
          <button
            mat-stroked-button
            color="primary"
            (click)="dispatch(action)"
          >{{ action.name }}</button>
        }
      </div>
    </div>
    <mat-divider />
  }
  `,
  styleUrls: ['./thread-messages-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ThreadMessagesSectionOrganismStore,
      inputs: ['comments', 'noCommentMessage', 'commentActions']
    }
  ]
})
export class ThreadMessagesSectionOrganism extends NgAtomicComponent {
  protected store = inject(ThreadMessagesSectionOrganismStore);
}
