const test = require('tape');

const ogen = require('../ogen');

test('basic observable', assert => {
  const msg = 'should create observable from generator';

  const generator = function* () {
    yield 1;
    yield 2;
    yield 3;
  };
  const observable = ogen(generator)();

  const actual = [];
  const expected = [1, 2, 3];

  observable.subscribe(item => {
    actual.push(item);
  },
  null,
  () => {
    assert.same(actual, expected, msg);
    assert.end();
  });
});

test('with promises', assert => {
  const msg = 'should wait for promises to resolve';

  const fetchSomething = () => new Promise((resolve) => {
    setTimeout(() => resolve('future value'), 10);
  });

  const generator = function* () {
    const result = yield fetchSomething(); // returns promise

    // waits for promise and uses promise result
    yield result + ' 2';
  };

  const observable = ogen(generator)();

  const actual = [];
  const expected = ['future value', 'future value 2'];

  observable.subscribe(item => {
    actual.push(item);
  },
  null,
  () => {
    assert.same(actual, expected, msg);
    assert.end();
  });
});

test('with arguments', assert => {
  const msg = 'should pass args to generator';

  const generator = function* (param1, param2, param3) {
    yield param1;
    yield param2;
    yield param3;
  };
  const observable = ogen(generator)(1, 2, 3);

  const actual = [];
  const expected = [1, 2, 3];

  observable.subscribe(item => {
    actual.push(item);
  },
  null,
  () => {
    assert.same(actual, expected, msg);
    assert.end();
  });
});

test('rejected promise', assert => {
  const msg = 'should notify on error';
  const halt = 'should not emit more data';
  const noComplete = 'should not notify on complete';

  const fetchSomething = () => new Promise((x, reject) => {
    setTimeout(() =>
      reject(new Error('Could not fetch data')), 10);
  });

  const generator = function* () {
    const result = yield fetchSomething();

    // should not emit this
    yield result + ' 2';
  };

  const observable = ogen(generator)();

  observable.subscribe(val => {
    assert.fail(halt);
    assert.fail(`emitted: ${ val }`);
  },
  () => {
    assert.pass(msg);
    setTimeout(() => assert.end(), 10);
  },
  () => {
    assert.fail(noComplete);
  });
});


test('promise throw', assert => {
  const msg = 'should notify on error';
  const halt = 'should not emit more data';
  const noComplete = 'should not notify on complete';

  const fetchSomething = () => new Promise(() => {
    throw new Error('Could not fetch data');
  });

  const generator = function* () {
    const result = yield fetchSomething();

    // should not emit this
    yield result + ' 2';
  };

  const observable = ogen(generator)();

  observable.subscribe(val => {
    assert.fail(halt);
    assert.fail(`emitted: ${ val }`);
  },
  () => {
    assert.pass(msg);
    setTimeout(() => assert.end(), 10);
  },
  () => {
    assert.fail(noComplete);
  });
});

test('generator throw', assert => {
  const msg = 'should notify on error';
  const halt = 'should not emit more data';
  const noComplete = 'should not notify on complete';

  const generator = function* () {
    throw new Error('faulty generator');

    /* eslint-disable no-unreachable */
    yield 'should not emit this';
  };

  const observable = ogen(generator)();

  observable.subscribe(val => {
    assert.fail(halt);
    assert.fail(`emitted: ${ val }`);
  },
  () => {
    assert.pass(msg);
    setTimeout(() => assert.end(), 10);
  },
  () => {
    assert.fail(noComplete);
  });
});

test('Rx observable', assert => {
  const msg = 'should return fleshed out Rx Observable';

  const generator = function* () {
    yield 1;
    yield 2;
    yield 3;
  };
  const observable = ogen(generator)();

  const actual = [];
  const expected = [2, 4, 6];

  observable.map(n => n * 2).subscribe(item => {
    actual.push(item);
  },
  null,
  () => {
    assert.same(actual, expected, msg);
    assert.end();
  });
});
