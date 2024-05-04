import { trigger, transition, style, query, animate } from '@angular/animations';

export const OVERLAY_ANIMATION = trigger('hasNext', [
  transition(':enter', [
    query(':enter', [style({ transform: 'translateX(100%)', })]),
    query(':enter', [animate('300ms ease-out', style({ transform: 'translateX(0%)', }))]),
  ]),
  transition(':leave', [
    query(':leave', [style({ transform: 'translateX(0%)' })]),
    query(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))]),
  ]),
]);
