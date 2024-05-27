import { Directive, ElementRef, HostListener, inject, signal } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[fallbackSrc]',
})
export class FallbackSrcDirective {
  readonly fallbackSrc = signal('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
  protected el = inject(ElementRef<HTMLImageElement>)

  @HostListener('error')
  onError() {
    const element: HTMLImageElement = this.el.nativeElement;
    element.src = this.fallbackSrc();
  }
}