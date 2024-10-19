
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { operators } from '../src/operators.mjs';

describe('operators', () => {
  it('should have 3 operators', () => {
    assert.equal(Object.keys(operators).length, 3);
    assert.deepEqual(Object.keys(operators), ['as', 'into', 'on']);
  });

  describe('as', () => {
    it('should return undefined', () => assert.equal(operators.as({}, 'test', {}), undefined));

    it('should throw an exception when setting a value', () => {
      const map = {};
      operators.as(map, 'test', {});
      assert.throws(() => map.test = 1);
    });

    it('should not throw an exception when reading the value', () => {
      const map = {};
      operators.as(map, 'test', {});
      assert.doesNotThrow(() => map.test);
    });
  });

  describe('into', () => {
    it('should return undefined', () => assert.equal(operators.into({}, 'test', { set: () => null }, {}), undefined));
  
    it('should throw an exception when getting the alias', () => {
      const map = {};
      operators.into(map, 'test', { set: (elem, value) => elem['prop'] = value }, {});
      assert.throws(() => map.test);
    });
  
    it('should set a private property when binding an object', () => {
      const map = {};
      operators.into(map, 'test', { set: (elem, value) => elem['prop'] = value }, {});
      assert.equal(map.$test.length, 1);
      assert.ok('elem' in map.$test[0]);
      assert.ok('set' in map.$test[0]);
    });
  
    it('should bind one object', () => {
      const map = {}, elem = {};
      operators.into(map, 'test', { set: (elem, value) => elem['prop'] = value }, elem);
      map.test = 1;
      assert.equal(elem.prop, 1);
    });
  
    it('should bind two objects', () => {
      const map = {}, elem1 = {}, elem2 = {};
      operators.into(map, 'test', { set: (elem, value) => elem['propA'] = value }, elem1);
      operators.into(map, 'test', { set: (elem, value) => elem['propB'] = value }, elem2);
      map.test = 2;
      assert.equal(elem1.propA, 2);
      assert.equal(elem2.propB, 2);
    });
  });

  describe('on', () => {
    it('should return undefined', t => assert.equal(operators.on(mockElem(t), 'click', () => null), undefined));
  
    it('should add the event', t => {
      const elem = mockElem(t);
      const callback = () => null;
      operators.on(elem, 'click', callback);
      assert.equal(elem.addEventListener.mock.callCount(), 1);
      assert.equal(elem.addEventListener.mock.calls[0].arguments.length, 2);
      assert.equal(elem.addEventListener.mock.calls[0].arguments[0], 'click');
      assert.notEqual(elem.addEventListener.mock.calls[0].arguments[1], callback);
    });

    it('should invoke the event listener', t => {
      const elem = mockElem(t);
      const callback = t.mock.fn(() => null);
      operators.on(elem, 'click', callback); 

      const event = mockEvent(t);
      const callbackWrapper = elem.addEventListener.mock.calls[0].arguments[1];
      callbackWrapper(event);
      assert.equal(callback.mock.callCount(), 1);
      assert.equal(callback.mock.calls[0].arguments.length, 1);
      assert.equal(callback.mock.calls[0].arguments[0], event);
    });

    it('should handle event modifiers', t => {
      const elem = mockElem(t);
      operators.on(elem, 'click', () => null, ['prevent', 'stop']);

      const callbackWrapper = elem.addEventListener.mock.calls[0].arguments[1];
      const event = mockEvent(t);
      callbackWrapper(event);
      assert.equal(event.preventDefault.mock.callCount(), 1);
      assert.equal(event.preventDefault.mock.calls[0].arguments.length, 0);
      assert.equal(event.stopPropagation.mock.callCount(), 1);
      assert.equal(event.stopPropagation.mock.calls[0].arguments.length, 0);
    });
  });
});

const mockAllFuncs = (t, obj) => {
  Object.keys(obj)
    .filter(key => typeof obj[key] === 'function')
    .forEach(key => t.mock.method(obj, key));
  return obj;
};

const mockElem = t => mockAllFuncs(t, {
  addEventListener: () => undefined,
});

const mockEvent = t => mockAllFuncs(t, {
  preventDefault: () => undefined,
  stopPropagation: () => undefined,
});

