export type IDispatcherWatcher<T> = (value: T) => any;

export class Dispatcher<T> {
  private watchers: Map<number, IDispatcherWatcher<T>>;
  /**
   * Create a map containing all the callbacks
   * which will be executed on updates.
   */
  constructor() {
    this.watchers = new Map<number, IDispatcherWatcher<T>>();
  }
  /**
   * Add a callback to the dispatcher which will
   * be executed on updates.
   */
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
  /**
   * Provide a new value which will be passed to
   * the callbacks as they are all executed.
   */
  public dispatch(value: T): void {
    this.watchers.forEach(watcher => watcher(value));
  }
  /**
   * Remove all watchers from dispatcher.
   */
  public destroy(): void {
    this.watchers.clear();
  }
}
