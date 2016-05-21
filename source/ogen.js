const next = (iter, callbacks, prev = undefined) => {
  const { onNext, onComplete } = callbacks;
  const item = iter.next(prev);
  const value = item.value;

  if (item.done) {
    return onComplete();
  }

  onNext(value);
  setImmediate(() => next(iter, callbacks, value));
};

const ogen = (fn) => (...args) => ({
  subscribe: (onNext, onError, onComplete) => {
    next(fn(...args), { onNext, onError, onComplete });
  }
});

module.exports = ogen.ogen = ogen.default = ogen;
