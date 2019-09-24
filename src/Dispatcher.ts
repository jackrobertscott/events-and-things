export type IDispatcherListener<T> = (value: T) => any

export class Dispatcher<T> {
  private listeners: Map<number, IDispatcherListener<T>>
  /**
   * Create a map containing all the callbacks
   * which will be executed on updates.
   */
  constructor() {
    this.listeners = new Map<number, IDispatcherListener<T>>()
  }
  /**
   * Add a callback to the dispatcher which will
   * be executed on updates.
   */
  public listen(listener: IDispatcherListener<T>): () => void {
    let id: number
    do {
      id = Math.random()
    } while (this.listeners.has(id))
    this.listeners.set(id, listener)
    return () => {
      if (this.listeners.has(id)) {
        this.listeners.delete(id)
      }
    }
  }
  /**
   * Provide a new value which will be passed to
   * the callbacks as they are all executed.
   */
  public dispatch(value: T): void {
    this.listeners.forEach(listener => listener(value))
  }
  /**
   * Remove all listeners from dispatcher.
   */
  public destroy(): void {
    this.listeners.clear()
  }
}
