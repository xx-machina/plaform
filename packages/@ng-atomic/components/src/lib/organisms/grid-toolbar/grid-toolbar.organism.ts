import { ChangeDetectionStrategy, Component, Directive, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { NestedMenuMolecule } from '@ng-atomic/components/molecules/nested-menu';
import { ChipsInputFieldMolecule, ChipsInputFieldMoleculeStore } from '@ng-atomic/components/molecules/chips-input-field';
import { FormControl } from '@angular/forms';

export enum ActionId {
  COLUMNS = '[@ng-atomic/components/organisms/grid-toolbar] Columns',
  FILTERS = '[@ng-atomic/components/organisms/grid-toolbar] Filters',
  EXPORT = '[@ng-atomic/components/organisms/grid-toolbar] Export',
}

@TokenizedType()
@Directive({standalone: true, selector: 'organisms-grid-toolbar'})
export class GridToolbarOrganismStore extends InjectableComponent {
  readonly actions = input<Action[]>([
    {
      id: ActionId.COLUMNS,
      icon: 'view_column',
      name: 'Columns',
    },
    {
      id: ActionId.FILTERS,
      icon: 'filter_list',
      name: 'Filters',
    },
    {
      id: 'Display',
      icon: 'display_settings',
      name: 'Display',
      children: [
        {
          id: 'Flat',
          name: 'Flat',
        },
        {
          id: 'Tree',
          name: 'Tree',
          children: [
            {
              id: 'A',
              name: 'A',
            },
            {
              id: 'B',
              name: 'B',
            }
          ]
        },
      ],
    },
    {
      id: ActionId.EXPORT,
      icon: 'download',
      name: 'Export'
    },
  ]);

  readonly control = input(new FormControl<string>(''));
}

@Component({
  selector: 'organisms-grid-toolbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NestedMenuMolecule,
  ],
  template: `
    <div>
      @for(action of store.actions(); track action.id) {
        @if (action.children) {
          <button
            mat-button
            color="basic"
            [matMenuTriggerFor]="menu.childMenu"
            [disabled]="action.disabled"
          ><mat-icon>{{ action.icon }}</mat-icon> <span>{{ action.name }}</span></button>
          <molecules-nested-menu
            #menu
            [actions]="action.children"
            (action)="dispatch($event)"
          />
        }
        @else {
          <button
            mat-button
            color="basic"
            [disabled]="action.disabled"
            (click)="dispatch(action)"
          >
            <mat-icon>{{ action.icon }}</mat-icon><span>{{ action.name }}</span>
          </button>
        }
      }
    </div>
  `,
  styleUrls: ['./grid-toolbar.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: GridToolbarOrganismStore,
      inputs: ['actions', 'control'],
    },
  ],
})
export class GridToolbarOrganism extends NgAtomicComponent {
  protected store = inject(GridToolbarOrganismStore);
}
