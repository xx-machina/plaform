import { ComponentMirror, ComponentRef, DestroyRef, Directive, ElementRef, EmbeddedViewRef, EventEmitter, Injector, Input, Output, SimpleChange, SimpleChanges, Type, ViewContainerRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { reflectComponentType } from "@angular/core";
import { Action } from "./action";
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
  return { provide: (abstract as any)['TOKEN'], useValue: loadComponentType };
}

export enum HostType {
  Dir = 'ɵdir',
  Cmp = 'ɵcmp',
}

type IO = {propName: string, templateName: string};

export function getMeta<T>(type: Type<T>) {
  return (type as any)[HostType.Cmp] || (type as any)[HostType.Dir];
}

export function getInputs<T>(type: Type<T>): IO[] {
  return Object.entries<string>(getMeta(type)['inputs'])
    .map(([propName, templateName]) => ({propName, templateName}));
}

export function getOutputs<T>(type: Type<T>): IO[] {
  return Object.entries<string>(getMeta(type)['outputs'])
    .map(([propName, templateName]) => ({propName, templateName}));
}

export function getInputsByComponentRef<T extends {} = any>(cmp: ComponentRef<T>): IO[] {
  return getInputs(cmp.instance.constructor as Type<T>);
}

export function getOutputsByInstance<T extends {} = any>(cmp: ComponentRef<T>): IO[] {
  return getOutputs(cmp.instance.constructor as Type<T>);
}

@Directive({ standalone: true })
export abstract class InjectableComponent<T extends NgAtomicComponentStore = any> {
  readonly #outlet = inject(ViewContainerRef);
  readonly #injector = inject(Injector);
  readonly #destroy$ = inject(DestroyRef);
  readonly #el = inject(ElementRef);
  #component: ComponentRef<T> | null = null;
  #componentMirror: ComponentMirror<T> | null = null;

  #setAttribute() {
    const hostElement = (this.#component!.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    const attributes: NamedNodeMap = this.#el.nativeElement.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes.item(i)!;
      if (attr.name.startsWith('_ngcontent')) {
        hostElement.setAttribute(attr.name, attr.value);
      }
    }
  }

  #bindInputs() {
    // for (const input of this.#componentMirror!.inputs) {
    //   if (input.propName === 'injectable') return;
    //   this.#component!.setInput(input.propName, (this as any)[input.propName]);
    // }

    for (const input of getInputs(this.constructor as Type<T>)) {
      if (input.propName === 'injectable') return;
      this.#component!.setInput(input.propName, (this as any)[input.propName]);
    }
  }

  #bindOutputs() {
    // for (const output of this.#componentMirror!.outputs) {
    //   (this.#component!.instance as any)[output.templateName].pipe(
    //     takeUntilDestroyed(this.#destroy$)
    //   ).subscribe((value: any) => (this as any)[output.templateName].emit(value));
    // }

    for (const output of getOutputs(this.constructor as Type<T>)) {
      (this.#component!.instance as any)[output.templateName]?.pipe(
        takeUntilDestroyed(this.#destroy$)
      ).subscribe((value: any) => {
        console.debug('output=>>', output.templateName, value);
        (this as any)[output.templateName].emit(value);
      });
    }
  }

  ngOnInit() {
    if (this.injectable) {
      this.#injector.get<TypeFactoryAsync<T>>((this.constructor as any)['TOKEN'])().then(type => {
        this.#component = this.#outlet.createComponent(type);
        this.#componentMirror = reflectComponentType(type);
        this.#bindInputs();
        this.#bindOutputs();
        this.#setAttribute();
      });
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.injectable && this.#componentMirror) {
      // for (const input of this.#componentMirror.inputs) {
      //   if (input.propName === 'injectable') return;
      //   const change = simpleChanges[input.propName] as SimpleChange;
      //   if (change) {
      //     this.#component!.setInput(input.propName, change.currentValue);
      //   }
      // }

      for (const input of getInputs(this.constructor as Type<T>)) {
        if (input.propName === 'injectable') return;
        const change = simpleChanges[input.propName] as SimpleChange;
        if (change) {
          this.#component!.setInput(input.propName, change.currentValue);
        }
      }
    }
  }

  @Input({transform: (value: any) => value === '' ? true : value})
  private injectable = false;

  @Output()
  protected action = new EventEmitter<Action>();
}
