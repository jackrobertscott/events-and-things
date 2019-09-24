import { Dispatcher, IDispatcherListener } from './Dispatcher';

export interface IValue {
  [name: string]: any;
}

export interface IStore<T> {
  local?: string;
  defaults: T;
}

export class Store<T extends IValue> {
  private value: T;
  private defaults: T;
  private dispatcher: Dispatcher<T>;
  private local?: string;

  constructor({ defaults, local }: IStore<T>) {
    this.value = defaults;
    this.defaults = defaults;
    this.dispatcher = new Dispatcher<T>();
    this.local = local;
    if (this.local) {
      try {
        const data = localStorage.getItem(this.local);
        this.value = data ? JSON.parse(data) : this.value;
      } catch (e) {
        console.error(e);
        localStorage.removeItem(this.local);
      }
    }
  }

  public change(data?: Partial<T>): void {
    this.value = {
      ...this.defaults,
      ...this.value,
      ...(data || {}),
    };
    if (this.local) {
      try {
        const update = JSON.stringify(this.value);
        localStorage.setItem(this.local, update);
      } catch (e) {
        console.error(e);
        localStorage.removeItem(this.local);
      }
    }
    this.dispatcher.dispatch(this.value);
  }

  public reset(): void {
    this.value = { ...this.defaults };
    if (this.local) {
      try {
        const update = JSON.stringify(this.value);
        localStorage.setItem(this.local, update);
      } catch (e) {
        console.error(e);
        localStorage.removeItem(this.local);
      }
    }
    this.dispatcher.dispatch(this.value);
  }

  public listen(listener: IDispatcherListener<T>): () => void {
    return this.dispatcher.listen(listener);
  }

  public state(): T {
    return { ...this.value };
  }
}
