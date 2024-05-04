import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Terminal } from 'xterm';

@Component({
  selector: 'organisms-terminal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #terminal></div>
  `,
  styleUrls: ['./terminal.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalOrganism {
  @ViewChild('terminal')
  terminal!: ElementRef<HTMLDivElement>;

  @Input()
  xterm: Terminal | null = null;

  async ngAfterViewInit() {
    this.xterm.open(this.terminal.nativeElement);
  }
}
