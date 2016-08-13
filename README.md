# Ogen

An observable version of async/await using regular generators. Short for (O)bservable (Gen)erator.

Write asynchronous code that looks synchronous, then tame your yielded values with observable methods like `.map()`, `.filter()`, `.take()`, `.zip()`, `.skip()`, etc...

## Installing

```
npm install ogen --save
```

## import / require

```js
// ES6 Module import
import ogen from 'ogen';
```

```js
// Node module import
const ogen = require('ogen');
```

Ogen uses **generator functions** to work its magic. If you don't know what they are, read: ["7 Surprising Things I Learned Writing a Fibonacci Generator in JavaScript"](https://medium.com/javascript-scene/7-surprising-things-i-learned-writing-a-fibonacci-generator-4886a5c87710) and ["The Hidden Power of ES6 Generators: Observable Async Flow Control"](https://medium.com/javascript-scene/the-hidden-power-of-es6-generators-observable-async-flow-control-cfa4c7f31435), which describes the inner workings of Ogen in-depth.

When you yield a promise, Ogen intercepts it, waits for it to resolve, unwraps the resolved value, and passes the yielded value back into your function, assigning it to the left side variable:

```js
const myFunc = function* (param1, param2, param3) {
  const result = yield fetchSomething(); // returns promise

  // waits for promise and uses promise result
  yield result + ' 2';
  yield param1;
  yield param2;
  yield param3;
};
```

Notice you can also yield any number of synchronous values, or any number of promises. All of your `yield` statements will yield observable values.

Pass your generator function into `ogen()` and get back an observable that lets you subscribe to all the yielded values:

```js
const onNext = val => console.log(val);
const onError = err => console.log(err);
const onComplete = () => console.log('done.');

const asyncFunc = ogen(myFunc);

// Call the async function and pass params.
asyncFunc('a param', 'another param', 'more params!')
  .subscribe(onNext, onError, onComplete);
// future value
// future value 2
// a param
// another param
// more params!
// done.
```

Ogen returns a full [Rx Observable instance](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/libraries/main/rx.md#observable-instance-methods), which means you can `.map()`, `.filter()` and `.skip()` to your heart’s content, among other things.

For a much more detailed description of how what Observables are all about, watch ["Asynchronous Programming at Netflix"](https://www.youtube.com/watch?v=gawmdhCNy-A).


## Breaking Changes in 2.0.0

As of v2.0.0, Ogen returns an RxJS 5 Observable, meaning that it complies with the current ESNext Observable standard proposal. This is a breaking change.

For migration help, see [rxjs/Migration](https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md).

## Platform Notes

Obviously, this relies on generators. Works OK with Babel, Node v4+.
**Does not work in any IE without polyfills.**

Should work in most other modern browsers.


Written for Learn JavaScript with Eric Elliott
==============================================
<a href="https://ericelliottjs.com"><img width="1200" alt="eejs-screenshot" src="https://cloud.githubusercontent.com/assets/364727/8640836/76d86618-28c3-11e5-8b6e-27d9cd72180e.png"></a>

[![Join the chat at https://gitter.im/learn-javascript-courses/javascript-questions](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/learn-javascript-courses/javascript-questions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An online course series for application developers. Ready to jump in? [Learn more](https://ericelliottjs.com/).
