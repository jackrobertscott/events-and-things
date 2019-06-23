export type IDispatcherWatcher<T> = (value: T) => any;

export class Dispatcher<T> {
  private watchers: Map<number, IDispatcherWatcher<T>>;

  constructor() {
    this.watchers = new Map<number, IDispatcherWatcher<T>>();
  }

  public watch(watcher: IDispatcherWatcher<T>): () => void {
    let id: number;
    do {
      id = Math.random();
    } while (this.watchers.has(id));
    this.watchers.set(id, watcher);
    return () => {
      if (this.watchers.has(id)) {
        this.watchers.delete(id);
      }
    };
  }

  public dispatch(value: T): void {
    this.watchers.forEach(watcher => watcher(value));
  }
}
