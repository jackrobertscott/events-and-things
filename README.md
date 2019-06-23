# events-and-things

> ✨ Classes which go beyond plain JavaScript.

## Installation

Using npm:

```shell
npm i --save events-and-things
```

Using yarn:

```shell
yarn add events-and-things
```

This package was created by the makers of [Window Gadgets](https://windowgadgets.io).

## Dispatcher

The dispatcher is a class which allows you to send and listen to events with ease.

### Usage

Create an instance of the dispatcher. This allows you to dispatch and listen to events in different areas of an application.

```ts
import { Dispatcher } from 'events-and-things';

const carDispatcher = new Dispatcher();

carDispatcher.dispatch({ model: 'Ford Mustang' });

carDispatcher.listen(({ model }) => {
  console.log(`Car model is: ${model}.`);
});
```

This is better than a promise as a promise must handle the output of the resolver from the resolver itself. Also, promise's are can only handle one event where as this may handle multiple events.

## Credits

Made with ❤️ by the makers of [Window Gadgets](https://windowgadgets.io).
