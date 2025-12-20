
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { capitalize, iterateObj, profileAllMethods, walkObj, wrapMethod } from '../src/utils.mjs';

describe('utils', () => {
  describe('capitalize', () => {
    it('should return an empty string when empty string is specified', () => assert.equal(capitalize(''), ''));
    it('should uppercase the first char when one character is specified', () => assert.equal(capitalize('a'), 'A'));
    it('should uppercase the first char', () => assert.equal(capitalize('abc'), 'Abc'));
  });

  describe('profileAllMethods', () => {
    it('should wrap all methods and return a new object', () => {
      const o = { methodA: () => 1, methodB: () => 2 };
      const stats = {};
      const newObj = profileAllMethods(o, stats);
      assert.notEqual(newObj, o);
      assert.notEqual(newObj.methodA, o.methodA);
      assert.notEqual(newObj.methodB, o.methodB);
    });
    
    it('should have stats populated for all methods', () => {
      const o = { methodA: () => 1, methodB: () => 2 };
      const stats = {};
      profileAllMethods(o, stats);
      assert.ok('methodA' in stats);
      assert.ok('methodB' in stats);
      assert.deepEqual(stats.methodA, { count: 0, total: 0, min: null, max: null, mean: null });
      assert.deepEqual(stats.methodB, { count: 0, total: 0, min: null, max: null, mean: null });
    });
    
    it('should collect stats when a method is called multiple time', () => {
      const o = { methodA: () => 1, methodB: () => 2 };
      const stats = {};
      const newObj = profileAllMethods(o, stats);
      newObj.methodA();
      newObj.methodA();
      assert.equal(stats.methodA.count, 2);
      assert.notDeepEqual(stats.methodA, { count: 0, total: 0, min: null, max: null, mean: null });
    });
  });

  describe('profileMethod', () => {
    // STUB
  });

  describe('wrapMethod', () => {
    it('should wrap the method with a new method', () => {
      const o = { oldMethod: () => 'old' };
      const newMethod = wrapMethod(o, 'oldMethod', () => 'new');
      assert.notEqual(newMethod, o.oldMethod);
    });

    it('should call the new method when invoked', () => {
      const o = { oldMethod: () => 'old' };
      const newMethod = wrapMethod(o, 'oldMethod', () => 'new');
      assert.equal(newMethod(), 'new');
    });

    it('should call the old method when calling proceed', () => {
      const o = { oldMethod: () => 'old' };
      const newMethod = wrapMethod(o, 'oldMethod', proceed => proceed());
      assert.equal(newMethod(), 'old');
    });

    it('should pass through arguments', () => {
      const o = { oldMethod: (bool, num, str) => ({ bool, num, str }) };
      const newMethod = wrapMethod(o, 'oldMethod', proceed => proceed());
      assert.deepEqual(newMethod(true, 1, 'a'), { bool: true, num: 1, str: 'a' });
      assert.deepEqual(newMethod(false, 0, ''), { bool: false, num: 0, str: '' });
    });
  });

  describe('iterateObj', () => {
    it('should iterate an array', () => {
      const test = [undefined, null, false, 0, ''];
      const expected = [
        undefined, 0, test,
        null, 1, test,
        false, 2, test,
        0, 3, test,
        '', 4, test,
      ];

      const actual = [];
      iterateObj(test, (value, key, obj) => actual.push(value, key, obj));
      assert.deepEqual(actual, expected);
    });

    it('should iterate an object', () => {
      const test = { u: undefined, l: null, b: false, n: 0, s: '' };
      const expected = [
        undefined, 'u', test,
        null, 'l', test,
        false, 'b', test,
        0, 'n', test,
        '', 's', test,
      ];

      const actual = [];
      iterateObj(test, (value, key, obj) => actual.push(value, key, obj));
      assert.deepEqual(actual, expected);
    });
  });

  describe('walkObj', () => {
    it('should walk the entire object', () => {
      const test = {
        obj1: {
          obj2: {
            num2: 2,
          }
        },
        arr1: [
          { obj3: { bool: true } },
          2,
          'two',
          null,
          undefined,
        ],
      };
      const expected = [
        2, 'num2',
        true, 'bool',
        2, 1,
        'two', 2,
        null, 3,
        undefined, 4,
      ];

      const actual = [];
      walkObj(test, (value, key) => actual.push(value, key));
      assert.deepEqual(actual, expected);
    });

    it('should throw an error', () => {
      assert.throws(() => walkObj(undefined, () => null));
      assert.throws(() => walkObj(null, () => null));
      assert.throws(() => walkObj(0, () => null));
      assert.throws(() => walkObj('', () => null));
    });
  });
});

