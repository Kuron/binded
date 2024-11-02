
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { capitalize, profileAllMethods, wrapMethod } from '../src/utils.mjs';

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
});

