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
