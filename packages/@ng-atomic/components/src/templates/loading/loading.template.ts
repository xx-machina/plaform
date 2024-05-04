import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'templates-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './loading.template.html',
  styleUrls: ['./loading.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingTemplate { }
