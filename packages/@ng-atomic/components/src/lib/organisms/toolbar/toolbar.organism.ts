import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgAtomicComponent } from '@ng-atomic/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Action } from '@ng-atomic/core';

enum ActionId {
}

@Component({
  selector: 'organisms-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="start">
      <mat-slider min="360" max="1920" step="10">
        <input [formControl]="form.get(['width'])" matSliderThumb>
      </mat-slider>
      <!-- <span>width: {{ form.get(['width'])!.value }}</span> -->
    </div>
    <div class="center">
      <button 
        *ngFor="let action of actions"
        mat-icon-button color="primary"
        aria-label="screenshot button"
        (click)="dispatch(action)"
      >
        <mat-icon>{{ action.icon }}</mat-icon>
      </button>
    </div>
    <div class="end">
      <button 
        *ngFor="let action of endActions"
        mat-icon-button color="primary"
        aria-label="screenshot button"
        (click)="dispatch(action)"
      >
        <mat-icon>{{ action.icon }}</mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./toolbar.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarOrganism extends NgAtomicComponent {
  static ActionId = ActionId;

  @Input()
  form = new FormGroup({});

  @Input()
  actions = [];

  @Input()
  endActions: Action[] = [];
}
