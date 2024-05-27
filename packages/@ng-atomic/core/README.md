# @ng-atomic/core
`@ng-atomic/core` is a library that enables dependency injection for components.

## Install
```sh
$ npm i @ng-atomic/core
```

## Usage
```ts
import { Component, Directive, inject, input } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Effect, TokenizedType, provideComponent, InjectableComponent } from '@ng-atomic/core';
import { NgAtomicComponent } from '@ng-atomic/core';
import 'zone.js';

export enum ActionId {
  CREATE = 'Create',
}

@TokenizedType()
@Directive({ standalone: true, selector: 'example' })
export class ExampleComponentStore extends InjectableComponent {
  static readonly ActionId = ActionId;
  readonly name = input<string>('');
}

@Component({
  standalone: true,
  selector: `example`,
  template: `
  <div>{{ store.name() }}</div>
  <button (click)="onClick()">ADD</button>
  `,
  hostDirectives: [
    {
      directive: ExampleComponentStore,
      inputs: ['name'],
    },
  ],
})
export class ExampleComponent extends NgAtomicComponent {
  protected readonly store = inject(ExampleComponentStore);

  protected onClick() {
    this.dispatch({ id: ActionId.CREATE, payload: 'ADD' });
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExampleComponentStore],
  template: `
    <example [name]="'test'" (action)="dispatch($event)" injectable/>
  `,
  providers: [provideComponent(ExampleComponentStore, () => ExampleComponent)],
})
export class App extends NgAtomicComponent {
  @Effect(ExampleComponentStore.ActionId.CREATE)
  protected create() {
    alert('created!!');
  }
}

bootstrapApplication(App);
```

# LISENCE
MIT
