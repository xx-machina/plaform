import { Route } from "@angular/router";
import { BlankPage } from "./blank.page";

export const BLANK_ROUTE: Route = {
  path: '',
  children: [
    {
      path: '',
      component: BlankPage
    }
  ],
  data: {isBlank: true},
};
