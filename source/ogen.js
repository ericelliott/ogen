/* eslint-disable no-use-before-define */
if (typeof setImmediate !== 'function') {
  var setImmediate = fn => setTimeout(fn, 0);
}

const isPromise = (obj) => typeof obj !== 'undefined' &&
  typeof obj.then === 'function';

const next = (iter, callbacks, prev = undefined) => {
  const {
    onNext,
    onError,
    onComplete
  } = callbacks;

  let item;

  try {
    item = iter.next(prev);
  } catch (err) {
    return onError(err);
  }

  const value = item.value;

  if (item.done) {
    return onComplete();
  }

  if (isPromise(value)) {
    value.then(val => {
      onNext(val);
      setImmediate(() => next(iter, callbacks, val));
    }).catch(err => {
      return onError(err);
    });
  } else {
    onNext(value);
    setImmediate(() => next(iter, callbacks, value));
  }
};

const ogen = (fn) => (...args) => ({
  subscribe: (onNext, onError, onComplete) => {
    next(fn(...args), { onNext, onError, onComplete });
  }
});

module.exports = ogen.ogen = ogen.default = ogen;
