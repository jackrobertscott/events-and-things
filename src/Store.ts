import { Dispatcher, IDispatcherListener } from './Dispatcher'

export class Store<T> {
  private value: T
  private initial: T
  private dispatcher: Dispatcher<T>
  private local?: string

  constructor(initial: T, key?: string) {
    this.value = initial
    this.initial = initial
    this.dispatcher = new Dispatcher<T>()
    this.local = key
    if (this.local) {
      try {
        const data = localStorage.getItem(this.local)
        this.value = data ? JSON.parse(data) : this.value
      } catch (e) {
        console.error(e)
        localStorage.removeItem(this.local)
      }
    }
  }

  public change(data: T): void {
    this.value = data
    this.persist(this.value)
    this.dispatcher.dispatch(this.value)
  }

  public reset(): void {
    this.value = this.initial
    this.persist(this.value)
    this.dispatcher.dispatch(this.value)
  }

  public listen(listener: IDispatcherListener<T>): () => void {
    return this.dispatcher.listen(listener)
  }

  public get state(): T {
    return this.value
  }

  private persist(data: T) {
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
}
