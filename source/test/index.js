const test = require('tape');

const ogen = require('ogen');

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
