import { Route } from "@angular/router";

export const BLANK_ROUTE: Route = {
  path: '',
  loadChildren: () => import('./blank.routes').then(m => m.routes),
  data: {isBlank: true},
};
