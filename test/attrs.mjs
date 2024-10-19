
// Only test the definition. The operators handle most of the work already.

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { attributes } from '../src/attrs.mjs';

describe('attrs', () => {
  it('should have 6 attributes', () => assert.equal(Object.keys(attributes).length, 6));
  it('should all have a name', () => assert.ok(attributes.every(({ name }) => typeof name === 'string' && name.length)));
  it('should all have at least 1 processor', () => assert.ok(attributes.every(({ processor }) => Object.keys(processor).length)));

  describe('attr', () => {
    let attr = attributes[0];
    it('should be named, attr', () => assert.equal(attr.name, 'attr'));
    it('should have the expected descriptor', () => assert.deepEqual(attr.descriptor, { reqLeft: true }));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 1));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
  });

  describe('elem', () => {
    let attr = attributes[1];
    it('should be named, elem', () => assert.equal(attr.name, 'elem'));
    it('should have the expected descriptor', () => assert.ok(!(attr.descriptor)));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 1));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
  });

  describe('event', () => {
    let attr = attributes[2];
    it('should be named, event', () => assert.equal(attr.name, 'event'));
    it('should have the expected descriptor', () => assert.deepEqual(attr.descriptor, { reqContext: true, reqLeft: true }));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 1));
    it('should have an "on" processor', () => assert.ok('on' in attr.processor));
  });

  describe('html', () => {
    let attr = attributes[3];
    it('should be named, html', () => assert.equal(attr.name, 'html'));
    it('should have the expected descriptor', () => assert.ok(!(attr.descriptor)));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 1));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
  });

  describe('prop', () => {
    let attr = attributes[4];
    it('should be named, prop', () => assert.equal(attr.name, 'prop'));
    it('should have the expected descriptor', () => assert.deepEqual(attr.descriptor, { reqLeft: true }));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
  });

  describe('text', () => {
    let attr = attributes[5];
    it('should be named, text', () => assert.equal(attr.name, 'text'));
    it('should have the expected descriptor', () => assert.ok(!(attr.descriptor)));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 1));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
  });
});

