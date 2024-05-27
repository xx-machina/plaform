import { ComponentMirror, ComponentRef, DestroyRef, Directive, ɵoutput, ElementRef, EmbeddedViewRef, InjectionToken, Injector, SimpleChange, SimpleChanges, Type, ViewContainerRef, inject, input, PLATFORM_ID } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { reflectComponentType } from "@angular/core";
import { Action } from "./action";

export type TypeFactoryAsync<T> = () => Promise<Type<T>>;

export type TypeFactory<T> = () => (Type<T> | Promise<Type<T>>);
import { proxyFakeComputedInputs } from "./signals";
import { isPlatformBrowser } from "@angular/common";

export const TOKEN = 'Δtkn';

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
  return { provide: (abstract as any)[TOKEN], useValue: loadComponentType };
}

export function TokenizedType() {
  return function <T extends Type<any>>(type: T) {
    (type as any)[TOKEN] = new InjectionToken<T>(type.name);
  };
}

export function getToken(type: Type<any>) {
  return (type as any)[TOKEN];
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
    .map(([templateName, [propName]]) => ({propName, templateName}));
}

export function getOutputs<T>(type: Type<T>): IO[] {
  const meta = getMeta(type);
  return Object.entries<string>(meta['outputs'])
    .map(([templateName, propName]) => ({propName, templateName}));
}

export function getInputsByComponentRef<T extends {} = any>(cmp: ComponentRef<T>): IO[] {
  return getInputs(cmp.instance.constructor as Type<T>);
}

export function getOutputsByInstance<T extends {} = any>(cmp: ComponentRef<T>): IO[] {
  return getOutputs(cmp.instance.constructor as Type<T>);
}

@Directive({
  standalone: true,
  // host: {ngSkipHydration: 'true'}
})
export class InjectableComponent<T = any> {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #injector = inject(Injector);
  readonly #destroyRef = inject(DestroyRef);
  readonly #el: ElementRef<HTMLElement> = inject(ElementRef);
  #component: ComponentRef<T> | null = null;
  #componentMirror: ComponentMirror<T> | null = null;

  readonly injectable = input(false, {transform: (value: any) => value === '' ? true : value, alias: 'injectable'});
  readonly __action = ɵoutput<Action>({alias: 'action'});

  dispatch(action: Action) {
    this.__action.emit(action);
  }

  get #inputs(): IO[] {
    const abs = getInputs(this.constructor as Type<T>);
    return abs;
  }

  get #outputs(): IO[] {
    const abs = getOutputs(this.constructor as Type<T>);
    return abs;
    // const impl = this.#componentMirror!.outputs;
    // return abs.filter(abstractOutput => impl.some(implOutput => implOutput.templateName === abstractOutput.templateName));
  }

  #setAttribute() {
    const hostElement = (this.#component!.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    const attributes: NamedNodeMap = this.#el.nativeElement.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes.item(i)!;
      if (attr.name === 'injectable') {
        hostElement.setAttribute('injected', '');
      } else {
        hostElement.setAttribute(attr.name, attr.value);
      }
    }
  }

  #bindInputs() {
    for (const input of this.#inputs) {
      if (input.propName === 'injectable') continue;
      const valueOrInputValueFn = this[input.propName];
      const value = typeof valueOrInputValueFn === 'function' ? valueOrInputValueFn() : valueOrInputValueFn;
      this.#component!.setInput(input.templateName, value);
    }
  }

  get propNames() {
    return this.#inputs.map(input => input.propName);
  }

  proxyFakeComputedInputs() {
    proxyFakeComputedInputs(this, this.propNames);
  }

  #bindOutputs() {
    for (const output of this.#outputs) {
      (this.#component!.instance as any)[output.propName]?.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe((value: any) => this[output.propName].emit(value));
    }
  }

  #bindEvents() {
    for (const name of ['click']) {
      this.#component.injector.get(ElementRef).nativeElement.addEventListener(name, (event) => {
        this.#el.nativeElement.dispatchEvent(new Event(name, {}));
      });
    }
  }
  
  constructor() {
    this.proxyFakeComputedInputs();
  }

  ngOnInit() {
    if (this.injectable() && isPlatformBrowser(this.#platformId)) {
      this.#injector.get<TypeFactoryAsync<T>>(getToken(this.constructor as any))().then(type => {
        this.#component = this.#viewContainerRef.createComponent(type, {
          projectableNodes: [
            Array.from(this.#el.nativeElement.childNodes)
          ],
        });
        this.#componentMirror = reflectComponentType(type);
        this.#bindInputs();
        this.#bindOutputs();
        this.#bindEvents();
        this.#setAttribute();
        // this.#viewContainerRef.remove(0);
        this.#component.changeDetectorRef.detectChanges();
        // this.#el.nativeElement.remove();
      });
    }
    this.proxyFakeComputedInputs();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.injectable() && this.#componentMirror) {
      for (const input of this.#inputs) {
        if (input.propName === 'injectable') return;
        const change = simpleChanges[input.propName] as SimpleChange;
        if (change) {
          this.#component!.setInput(input.propName, change.currentValue);
        }
      }
    }
  }
}
