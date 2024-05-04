import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input,  HostBinding } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { catchError, map, Observable, of, ReplaySubject, switchMap } from 'rxjs';


@Component({
  selector: 'atoms-icon',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './icon.atom.html',
  styleUrls: ['./icon.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconAtom {

  name$ = new ReplaySubject<string>(1);
  hasSvgIcon$: Observable<boolean> = this.name$.pipe(
    switchMap((name: string) => this.registry.getNamedSvgIcon(name)),
    map(svgIcon => !!svgIcon),
    catchError(() => of(false)),
  );

  @Input()
  set name(_name: string) {
    this.name$.next(_name)
  };

  @HostBinding('style.--color')
  @Input()
  color?: string;

  constructor(private registry: MatIconRegistry) { }

}
