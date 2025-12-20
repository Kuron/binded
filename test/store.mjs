
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getStore, hasStore, setStore } from '../src/store.mjs';

describe('store', () => {
  describe('setStore', () => {
    it('should return null with an invalid group', () => assert.equal(null, setStore('INVALID', 'name', 'value')));
    it('should return null with an valid group', () => assert.equal(null, setStore('prop', 'name', 'value')));
  });

  describe('getStore', () => {
    setStore('prop', 'name', 'value');

    it('should return null with an invalid group', () => assert.equal(null, getStore('INVALID', 'name')));
    it('should return null with a valid group but invalid name', () => assert.equal(null, getStore('prop', 'INVALID')));
    it('should return the value', () => assert.equal('value', getStore('prop', 'name')));
  });

  describe('hasStore', () => {
    it('should not have any group', () => assert.equal(false, hasStore('test')));
    it('should not have any name', () => assert.equal(false, hasStore('test', 'name')));
    it('should have a "prop" group', () => assert.equal(true, hasStore('prop')));
    it('should have a name under "prop"', () => {
      setStore('prop', 'name', 'value');
      assert.equal('value', getStore('prop', 'name'));
    });
  });
});

