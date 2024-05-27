import { trigger, transition, style, query, animate } from '@angular/animations';

export const OVERLAY_ANIMATION = trigger('hasNext', [
  transition(':enter', [
    style({ transform: 'translateX(50%)', }),
    animate('500ms ease-out', style({ transform: 'translateX(0%)', })),
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0%)' }),
    animate('500ms ease-in', style({ transform: 'translateX(100%)' })),
  ]),
]);
