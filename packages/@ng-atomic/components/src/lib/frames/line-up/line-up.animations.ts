import { animate, query, sequence, state, style, transition, trigger, group } from '@angular/animations';

export const LINE_UP_ANIMATIONS = [
  trigger('hasNext', [
    transition(':enter', [
      query(':enter', [style({ transform: 'translateX(-100%)', })], { optional: true }),
      query(':enter', [animate('300ms ease-out', style({ transform: 'translateX(0%)', })),], { optional: true }),
    ]),
    transition(':leave', [
      query(':leave', [style({transform: 'translateX(0%)'})], { optional: true }),
      query(':leave', [animate('300ms ease-in', style({transform: 'translateX(-100%)'}))], { optional: true }),
    ]),
  ])
];
