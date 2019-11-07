import { Dispatcher } from './Dispatcher'

export class Store<T> {
  private value: T
  private initial: T
  private dispatcher: Dispatcher<T>
  private local?: string
  /**
   * Create store from initial value or local storage.
   */
  constructor(initial: T, key?: string) {
    this.local = key
    this.initial = initial
    this.value = this.load() || initial
    this.dispatcher = new Dispatcher<T>()
  }
  /**
   * The current state of the store.
   */
  public get current(): T {
    return this.value
  }
  /**
   * Listen for changes to the store.
   */
  public listen(listener: (value: T) => void): () => void {
    return this.dispatcher.listen(listener)
  }
  /**
   * Set the stores state.
   */
  public change(data: T | ((current: T) => T)): void {
    this.value =
      typeof data === 'function'
        ? (data as (current: T) => T)(this.value)
        : (data as T)
    this.save(this.value)
    this.dispatcher.dispatch(this.value)
  }
  /**
   * Set the store back to the defaults.
   */
  public reset(): void {
    this.value = this.initial
    this.save(this.value)
    this.dispatcher.dispatch(this.value)
  }
  /**
   * Remove all listeners.
   */
  public destroy(): void {
    this.dispatcher.destroy()
  }
  /**
   * Save data to the local storage.
   */
  private save(data: T) {
    if (this.local) {
      try {
        const update = JSON.stringify(data)
        localStorage.setItem(this.local, update)
      } catch (e) {
        console.error(e)
        localStorage.removeItem(this.local)
      }
    }
  }
  /**
   * Load the data from the local storage.
   */
  private load() {
    if (this.local) {
      try {
        const data = localStorage.getItem(this.local)
        return data && JSON.parse(data)
      } catch (e) {
        console.error(e)
        localStorage.removeItem(this.local)
      }
    }
  }
}
