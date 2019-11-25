import { Store } from './Store'

export class KeyStore<T extends { [key: string]: any }> extends Store<T> {
  /**
   * Extend the generic value as object.
   */
  constructor(initial: T, key?: string) {
    super(initial, key)
  }
  /**
   * Add an update method which patches rather than sets.
   */
  public update(data: Partial<T>) {
    this.change(current => ({ ...current, ...data }))
  }
  /**
   * Allow users to override the default items.
   */
  public recreate(overrides: Partial<T> = {}) {
    this.change({ ...this.initial, ...overrides })
  }
}
