# @ng-atomic/core

## Concept
- Injectable Component
- Action and Effect

## Example

```ts
@Directive({standalone: true, selector: 'example'})
export class ExampleComponentStore extends InjectableComponent {
  @Input() name: string;
}

@Component({
  standalone: true,
  selector: 'example',
  hostDirectives: [ExampleComponentStore],
  template: `<button (click)="onButtonClick()">{{ store.name }}</button>`
})
export class ExampleComponent extends NgAtomicComponent {
  protected store = inject(ExampleComponentStore);

  protected onButtonClick() {
    this.dispatch({
      id: ActionId.BUTTON_CLICK,
      payload: 'Hello World!',
    });
  }
}

@Component({
  standalone: true,
  selector: 'example',
  imports: [
    // Import Injectable Component
    ExampleComponentStore
  ],
  template: `<example [name]="'example'" (action)="dispatch($event)" injectable/>`,
  provider: [
    // Provide Component Implementation
    provideComponent(ExampleComponentStore, () => ExampleComponent),
  ],
})
export class AppComponent extends NgAtomicComponent {
  @Effect(ExampleComponent.ActionId.BUTTON_CLICK)
  protected onButtonClick(message: string) {
    alert(message);
  }
}
```