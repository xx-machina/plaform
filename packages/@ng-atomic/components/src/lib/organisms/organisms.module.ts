import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/core";
import { MenuFooterOrganismStore } from "@ng-atomic/components/organisms/menu-footer";
import { MenuHeaderOrganismStore } from "@ng-atomic/components/organisms/menu-header";
import { NavigationListOrganismStore } from "@ng-atomic/components/organisms/navigation-list";
import { NavigatorOrganismStore } from "@ng-atomic/components/organisms/navigator";
import { GridToolbarOrganismStore } from "@ng-atomic/components/organisms/grid-toolbar";
import { TableOrganismStore } from "@ng-atomic/components/organisms/table";
import { PaginatorOrganismStore } from "@ng-atomic/components/organisms/paginator";
import { TextInputSectionOrganismStore } from "@ng-atomic/components/organisms/text-input-section";
import { ActionButtonsSectionOrganismStore } from "@ng-atomic/components/organisms/action-buttons-section";
import { NumberInputSectionOrganismStore } from "@ng-atomic/components/organisms/number-input-section";
import { TextareaSectionOrganismStore } from "@ng-atomic/components/organisms/textarea-section";
import { StripeInputSectionOrganismStore } from "@ng-atomic/components/organisms/stripe-input-section";
import { FileInputSectionOrganismStore } from "@ng-atomic/components/organisms/file-input-section";
import { PasswordInputSectionOrganismStore } from "@ng-atomic/components/organisms/password-input-section";
import { SelectInputSectionOrganismStore } from "@ng-atomic/components/organisms/select-input-section";
import { SmartListOrganismStore } from "@ng-atomic/components/organisms/smart-list";
import { ActionInputSectionOrganismStore } from "@ng-atomic/components/organisms/action-input-section";
import { MarkdownModule } from "ngx-markdown";

@NgModule({
  imports: [
    MarkdownModule.forRoot(),
  ]
})
export class NgAtomicOrganismsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicOrganismsModule,
      providers: [
        provideComponent(ActionInputSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/action-input-section').then(m => m.ActionInputSectionOrganism);
        }),
        provideComponent(ActionButtonsSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/action-buttons-section').then(m => m.ActionButtonsSectionOrganism);
        }),
        // FileInputSectionOrganismStore.Config.provide(),
        provideComponent(FileInputSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/file-input-section').then(m => m.FileInputSectionOrganism);
        }),
        provideComponent(GridToolbarOrganismStore, () => {
          return import('@ng-atomic/components/organisms/grid-toolbar').then(m => m.GridToolbarOrganism);
        }),
        provideComponent(PaginatorOrganismStore, () => {
          return import('@ng-atomic/components/organisms/paginator').then(m => m.PaginatorOrganism);
        }),
        provideComponent(PasswordInputSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/password-input-section').then(m => m.PasswordInputSectionOrganism);
        }),
        provideComponent(SelectInputSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/select-input-section').then(m => m.SelectInputSectionOrganism);
        }),
        StripeInputSectionOrganismStore.Config.provide(),
        provideComponent(StripeInputSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/stripe-input-section').then(m => m.StripeInputSectionOrganism);
        }),
        provideComponent(TableOrganismStore, () => {
          return import('@ng-atomic/components/organisms/table').then(m => m.TableOrganism);
        }),
        provideComponent(NavigatorOrganismStore, () => {
          return import('@ng-atomic/components/organisms/navigator').then(m => m.NavigatorOrganism);
        }),
        NavigatorOrganismStore.Config.provide(),
        provideComponent(NumberInputSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/number-input-section').then(m => m.NumberInputSectionOrganism);
        }),
        MenuHeaderOrganismStore.Config.provide(),
        provideComponent(MenuHeaderOrganismStore, () => {
          return import('@ng-atomic/components/organisms/menu-header').then(m => m.MenuHeaderOrganism);
        }),
        provideComponent(MenuFooterOrganismStore, () => {
          return import('@ng-atomic/components/organisms/menu-footer').then(m => m.MenuFooterOrganism);
        }),
        provideComponent(NavigationListOrganismStore, () => {
          return import('@ng-atomic/components/organisms/navigation-list').then(m => m.NavigationListOrganism);
        }),
        SmartListOrganismStore.Config.provide(),
        provideComponent(SmartListOrganismStore, () => {
          return import('@ng-atomic/components/organisms/smart-list').then(m => m.SmartListOrganism);
        }),
        provideComponent(TextInputSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/text-input-section').then(m => m.TextInputSectionOrganism);
        }),
        provideComponent(TextareaSectionOrganismStore, () => {
          return import('@ng-atomic/components/organisms/textarea-section').then(m => m.TextareaSectionOrganism);
        }),
      ]
    }
  }
}