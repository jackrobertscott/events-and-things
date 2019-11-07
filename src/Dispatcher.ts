export class Dispatcher<T> {
  private listeners: Map<number, (value: T) => void>
  /**
   * Create empty listener map.
   */
  constructor() {
    this.listeners = new Map<number, (value: T) => void>()
  }
  /**
   * Add listener to this dispatcher.
   */
  public listen(listener: (value: T) => void): () => void {
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
   * Execute all listeners with the provided value.
   */
  public dispatch(value: T): void {
    this.listeners.forEach(listener => listener(value))
  }
  /**
   * Remove all listeners.
   */
  public destroy(): void {
    this.listeners.clear()
  }
}
