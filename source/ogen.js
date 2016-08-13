const Rx = require('rxjs/Rx');

/* eslint-disable no-use-before-define */
if (typeof setImmediate !== 'function') {
  var setImmediate = fn => setTimeout(fn, 0);
}

const isPromise = (obj) => typeof obj !== 'undefined' &&
  typeof obj.then === 'function';

const next = (iter, observer, prev = undefined) => {

  let item;

  try {
    item = iter.next(prev);
  } catch (err) {
    return observer.error(err);
  }

  const value = item.value;

  if (item.done) {
    return observer.complete();
  }

  if (isPromise(value)) {
    value.then(val => {
      observer.next(val);
      setImmediate(() => next(iter, observer, val));
    }).catch(err => {
      return observer.error(err);
    });
  } else {
    observer.next(value);
    setImmediate(() => next(iter, observer, value));
  }
};

const ogen = (fn) => (...args) => {
  return Rx.Observable.create(observer => {
    next(fn(...args), observer);
  });
};

module.exports = ogen.ogen = ogen.default = ogen;
