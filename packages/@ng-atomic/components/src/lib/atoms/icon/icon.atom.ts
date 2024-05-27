import { Component, ChangeDetectionStrategy, Input, HostBinding, input, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { NgAtomicComponent } from '@ng-atomic/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';


@Component({
  selector: 'atoms-icon',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  template: `
  @if (hasSvgIcon()) {
    <mat-icon [svgIcon]="name()"></mat-icon>
  } @else {
    <mat-icon>{{ name() }}</mat-icon>
  }
  `,
  styleUrls: ['./icon.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconAtom extends NgAtomicComponent {
  readonly name = input('name');
  private registry = inject(MatIconRegistry);
  readonly hasSvgIcon$: Observable<boolean> = toObservable(this.name).pipe(
    switchMap((name: string) => this.registry.getNamedSvgIcon(name)),
    map(svgIcon => !!svgIcon),
    catchError(() => of(false)),
  );
  readonly hasSvgIcon = toSignal(this.hasSvgIcon$);

  @HostBinding('style.--color')
  @Input()
  color?: string;
}
