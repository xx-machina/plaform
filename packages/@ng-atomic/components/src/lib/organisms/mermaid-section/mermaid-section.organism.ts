import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import mermaid from 'mermaid';

@Component({
  selector: 'organisms-mermaid-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <pre #view></pre>
  `,
  styleUrls: ['./mermaid-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MermaidSectionOrganism implements OnChanges {
  constructor(
    private ngZone: NgZone,
  ) { }

  @ViewChild('view', { static: true })
  view: ElementRef<HTMLElement>;

  @Input()
  mermaid!: string;

  ngOnInit() {
    mermaid.initialize({
      // securityLevel: 
    });
  }

  ngAfterViewInit() {
    this.renderMermaid();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mermaid']) {
      this.renderMermaid()
      // this.ngZone.runOutsideAngular(() => this.renderMermaid());
    }
  }

  private renderMermaid() {
    mermaid.render('graphDiv', this.mermaid, this.view.nativeElement).then(({svg}) => {
      this.view.nativeElement.innerHTML = svg;
    });
  }

}
