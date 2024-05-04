import { ComponentRef, DestroyRef, Directive, ElementRef, EmbeddedViewRef, EventEmitter, Injector, Input, Output, Type, ViewContainerRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Action } from "@ng-atomic/common/models";
import { NgAtomicComponentStore } from "./component-store";

export type TypeFactoryAsync<T> = () => Promise<Type<T>>;

export type TypeFactory<T> = () => (Type<T> | Promise<Type<T>>);

export function provideComponent<ABS = any, IMPL = any>(
  abstract: Type<ABS>,
  typeOrFactory: Type<IMPL> | TypeFactory<IMPL>,
) {
  async function loadComponentType(): Promise<Type<IMPL>> {
    if (typeof typeOrFactory === 'function' && !typeOrFactory.prototype) {
      return await (typeOrFactory as TypeFactory<IMPL>)();
    } else {
      return typeOrFactory as Type<IMPL>;
    }
  };
  return { provide: abstract['TOKEN'], useValue: loadComponentType };
}

export function getInputs<T>(type: Type<T>, meta: 'ɵcmp' | 'ɵdir' = 'ɵcmp'): [string, string][] {
  return Object.entries(type[meta]['inputs']);
}

export function getInputsByComponentRef<T = any>(cmp: ComponentRef<T>): [string, string][] {
  return getInputs(cmp.instance.constructor as Type<T>);
}

export function getOutputsByInstance<T = any>(cmp: ComponentRef<T>): [string, string][] {
  return Object.entries(cmp.instance.constructor['ɵcmp']['outputs']);
}

@Directive({ standalone: true })
export class InjectableComponent<T extends NgAtomicComponentStore = any> {
  readonly #outlet = inject(ViewContainerRef);
  readonly #injector = inject(Injector);
  readonly #destroy$ = inject(DestroyRef);
  readonly #el = inject(ElementRef);

  #setAttribute(component: ComponentRef<T>) {
    const hostElement = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    const attributes: NamedNodeMap = this.#el.nativeElement.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes.item(i);
      if (attr.name.startsWith('_ngcontent')) {
        hostElement.setAttribute(attr.name, attr.value);
      }
    }
  }

  #bindInputs(component: ComponentRef<T>) {
    Object.entries(this.constructor['ɵdir']['inputs']).forEach(([key, value]: [string, string]) => {
      if (key === 'injectable') return;
      component.setInput(key, this[value]);
    });
  }

  #bindOutputs(component: ComponentRef<T>) {
    getOutputsByInstance(component).forEach(([alias, attr]: [string, string]) => {
      component.instance[attr].pipe(
        takeUntilDestroyed(this.#destroy$)
      ).subscribe((value) => this[attr].emit(value));
    });
  }

  ngOnInit() {
    if (this.injectable) {
      this.#injector.get<TypeFactoryAsync<T>>(this.constructor['TOKEN'])().then(type => {
        const ref = this.#outlet.createComponent(type);
        this.#bindInputs(ref);
        this.#bindOutputs(ref);
        this.#setAttribute(ref);
      });
    }
  }

  @Input({transform: (value: any) => value === '' ? true : value})
  private injectable = false;

  @Output()
  protected action = new EventEmitter<Action>();
}
