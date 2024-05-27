import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { NG_ATOMIC_DEBUG } from '../ng-atomic-debug';

const DEBUG_CONFIG = {
  outline: '1px',
  colors: {
    'templates': '#f00',
    'organisms': '#0f0',
    'molecules': '#00f',
    'atoms': '#ff0',
    'frames': 'transparent',
    'default': '#000',
  },
  excludes: ['frames', 'app', 'pages', 'atoms'],
};

@Directive({standalone: true, selector: 'debug'})
export class DebugDirective {
  protected el: ElementRef<HTMLElement> = inject(ElementRef);
  protected platformId = inject(PLATFORM_ID);
  protected isDebug = inject(NG_ATOMIC_DEBUG, {optional: true}) ?? false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && this.isDebug) {
      const name = this.el.nativeElement.tagName.toLowerCase();
      const type = name.split('-')[0];
      if (DEBUG_CONFIG.excludes.includes(type)) return;
      const color = DEBUG_CONFIG.colors?.[type] ?? DEBUG_CONFIG.colors.default;

      // 1pxのアウトラインを設定
      this.el.nativeElement.style.outline = `${DEBUG_CONFIG.outline} solid ${color}`;

      // 疑似要素でコンポーネント名を表示
      const labelEl = this.createLabelElement({
        name: `${name}${this.el.nativeElement.hasAttribute('injected') ? '[injected]' : ''}`,
        color
      });
      this.el.nativeElement.style.outlineOffset = '-1px';
      this.el.nativeElement.style.position = 'relative';
      this.el.nativeElement.appendChild(labelEl);
    }
  }

  protected createLabelElement(options: {
    name: string
    color: string
  }): HTMLElement {
    const content = document.createElement('span');
    content.textContent = options.name;
    content.style.backgroundColor = `${options.color}`;
    content.style.color = '#fff';
    content.style.padding = '2px 4px';
    content.style.position = 'absolute';
    content.style.fontSize = '10px';
    content.style.top = '0';
    content.style.left = '0';
    content.style.zIndex = '9999';
    content.style.lineHeight = '1.5em';
    content.style.whiteSpace = 'nowrap';
    return content;
  }
}