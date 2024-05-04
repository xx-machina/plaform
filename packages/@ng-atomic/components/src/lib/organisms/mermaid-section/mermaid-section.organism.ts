import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import mermaid from 'mermaid';

@Component({
  selector: 'organisms-mermaid-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <pre #view> {{ mermaid}} </pre>
  `,
  styleUrls: ['./mermaid-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MermaidSectionOrganism {
  @ViewChild('view', { static: true }) view: ElementRef;

  @Input()
  mermaid!: string;

  ngAfterViewInit(): void {
    mermaid.init({securityLevel: 'loose'}, this.view.nativeElement);
  }

  ngOnDestroy(): void {
    
  }
}
