import { Dispatcher } from './Dispatcher'

export class Radio<T> {
  private node?: Window
  private options: { origin?: string; key?: string }
  private dispatcher: Dispatcher<T>
  private handler: (event: MessageEvent) => void
  /**
   * Attach radio to the node or window.
   */
  constructor(
    node?: Window | null,
    options?: { origin?: string; key?: string }
  ) {
    this.node = node || (window && window.parent)
    this.options = options || {}
    this.dispatcher = new Dispatcher()
    this.handler = (event: MessageEvent) => this.listener(event)
    if (window) window.addEventListener('message', this.handler, false)
  }
  /**
   * Send a message through the radio.
   */
  public message(data: T): void {
    const value = { key: this.options.key, payload: data }
    if (this.node) this.node.postMessage(value, this.options.origin || '*')
  }
  /**
   * Listen to values recieved and returns an unlistener.
   */
  public listen(callback: (value: T) => any): () => void {
    return this.dispatcher.listen(callback)
  }
  /**
   * Remove all listeners.
   */
  public destroy(): void {
    if (window) window.removeEventListener('message', this.handler, false)
    this.dispatcher.destroy()
  }
  /**
   * Handle the events which are sent via the windows.
   */
  private listener(event: MessageEvent): void {
    const origin = this.options.origin
    if (!origin || origin === event.origin) {
      const data = event.data || {}
      if (this.options.key && this.options.key !== data.key) return
      this.dispatcher.dispatch(data.payload)
    }
  }
}
