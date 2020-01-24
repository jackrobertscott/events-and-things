import { Dispatcher } from './Dispatcher'
import * as Cookies from 'js-cookie'

export class Store<T> {
  protected value: T
  protected initial: T
  protected dispatcher: Dispatcher<T>
  protected local?: string
  protected cookies: boolean
  protected options?: Cookies.CookieAttributes
  /**
   * Create store from initial value or local storage.
   */
  constructor(
    initial: T,
    key?: string,
    cookies: boolean = false,
    options?: Cookies.CookieAttributes
  ) {
    this.local = key
    this.initial = initial
    this.value = this.load() || initial
    this.dispatcher = new Dispatcher<T>()
    this.cookies = cookies
    this.options = options
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
    this.change(this.initial)
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
    if (this.local && typeof window !== 'undefined') {
      try {
        const update = JSON.stringify(data)
        if (this.cookies) Cookies.set(this.local, update, this.options)
        else localStorage.setItem(this.local, update)
      } catch (e) {
        console.error(e)
        if (this.cookies) Cookies.remove(this.local, this.options)
        else localStorage.removeItem(this.local)
      }
    }
  }
  /**
   * Load the data from the local storage.
   */
  private load() {
    if (this.local && typeof window !== 'undefined') {
      try {
        const data = this.cookies
          ? Cookies.get(this.local)
          : localStorage.getItem(this.local)
        return data && JSON.parse(data)
      } catch (e) {
        console.error(e)
        if (this.cookies) Cookies.remove(this.local, this.options)
        else localStorage.removeItem(this.local)
      }
    }
  }
}
