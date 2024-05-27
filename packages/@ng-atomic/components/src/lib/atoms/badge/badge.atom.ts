import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'atoms-badge',
  standalone: true,
  imports: [
    BadgeAtom,
  ],
  template: `{{ value() }}`,
  styleUrl: './badge.atom.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeAtom {
  readonly value = input('value');
}
