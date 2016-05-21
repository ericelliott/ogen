# ogen

An observable Async/Await. An example for "Learn JavaScript with Eric Elliott"

Write asynchronous code that looks synchronous:

```js
const myFunc = function* (param1, param2, param3) {
  const result = yield fetchSomething(); // returns promise

  // waits for promise and uses promise result
  yield result + ' 2';
  yield param1;
  yield param2;
  yield param3;
}
```

Pass it into `ogen()` and get back an observable that you can subscribe to:

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


Written for Learn JavaScript with Eric Elliott
==============================================
<a href="https://ericelliottjs.com"><img width="1200" alt="eejs-screenshot" src="https://cloud.githubusercontent.com/assets/364727/8640836/76d86618-28c3-11e5-8b6e-27d9cd72180e.png"></a>

[![Join the chat at https://gitter.im/learn-javascript-courses/javascript-questions](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/learn-javascript-courses/javascript-questions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An online course series for application developers. Ready to jump in? [Learn more](https://ericelliottjs.com/).
