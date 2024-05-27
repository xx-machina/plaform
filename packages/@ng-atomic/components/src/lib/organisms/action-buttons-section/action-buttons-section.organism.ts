import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({
  standalone: true,
  selector: 'organisms-action-buttons-section',
  host: {class: 'organism section'},
})
export class ActionButtonsSectionOrganismStore extends InjectableComponent {
  readonly actions = input<Action[]>([]);
  readonly type = input<'basic' | 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab'>('raised');
}

@Component({
  selector: 'organisms-action-buttons-section',
  standalone: true,
  imports: [
    MatButtonModule,
  ],
  template: `
    @for (action of store.actions(); track action.id) {
      @switch (store.type()) {
        @case ('basic') {
          <button
            mat-button
            [color]="action.color"
            [disabled]="action?.disabled"
            (click)="dispatch(action)"
          >{{ action?.name }}</button>
        }
        @case ('raised') {
          <button
            mat-raised-button
            [color]="action.color"
            [disabled]="action?.disabled"
            (click)="dispatch(action)"
          >{{ action?.name }}</button>
        }
        @case ('stroked') {
          <button
            mat-stroked-button
            [color]="action.color"
            [disabled]="action?.disabled"
            (click)="dispatch(action)"
          >{{ action?.name }}</button>
        }
        @case ('flat') {
          <button
            mat-flat-button
            [color]="action.color"
            [disabled]="action?.disabled"
            (click)="dispatch(action)"
          >{{ action?.name }}</button>
        }
        @case ('icon') {
          <button
            mat-icon-button
            [color]="action.color"
            [disabled]="action?.disabled"
            (click)="dispatch(action)"
          >{{ action?.name }}</button>
        }
      }
    }
  `,
  styleUrls: ['./action-buttons-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism section'},
  hostDirectives: [
    {
      directive: ActionButtonsSectionOrganismStore,
      inputs: ['actions', 'type'],
    }
  ]
})
export class ActionButtonsSectionOrganism extends NgAtomicComponent {
  protected store = inject(ActionButtonsSectionOrganismStore);
}
