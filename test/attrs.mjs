
// Only test the definition. The operators handle most of the work already.

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { attributes } from '../src/attrs.mjs';
import { mockElem } from './lib/mocks.mjs';

describe('attrs', () => {
  it('should have 9 attributes', () => assert.equal(Object.keys(attributes).length, 9));
  it('should all have a name', () => assert.ok(attributes.every(({ name }) => typeof name === 'string' && name.length)));
  it('should all have at least 1 processor', () => assert.ok(attributes.every(({ processor }) => Object.keys(processor).length)));

  describe('attr', () => {
    let attr = attributes[0];
    it('should be named, attr', () => assert.equal(attr.name, 'attr'));
    it('should have the expected descriptor', () => assert.deepEqual(attr.descriptor, { reqLeft: true }));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
    it('should return a cleanup func for into', t => assert.equal('function', typeof attr.processor.into({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });

  describe('elem', () => {
    let attr = attributes[1];
    it('should be named, elem', () => assert.equal(attr.name, 'elem'));
    it('should have the expected descriptor', () => assert.ok(!attr.descriptor));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 1));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });

  describe('event', () => {
    let attr = attributes[2];
    it('should be named, event', () => assert.equal(attr.name, 'event'));
    it('should have the expected descriptor', () => assert.deepEqual(attr.descriptor, { validRightAttrs: ['prevent', 'stop'] }));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 1));
    it('should have an "on" processor', () => assert.ok('on' in attr.processor));
    it('should return a hooks obj for on', t => assert.deepEqual(['afterBinded', 'cleanup'], Object.keys(attr.processor.on({ elem: mockElem(t), expObj: { right: 'click' }, map: {} }))));
  });

  describe('hide', () => {
    let attr = attributes[3];
    it('should be named, hide', () => assert.equal(attr.name, 'hide'));
    it('should have the expected descriptor', () => assert.ok(!attr.descriptor));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
    it('should return a cleanup func for into', t => assert.equal('function', typeof attr.processor.into({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });
  
  describe('html', () => {
    let attr = attributes[4];
    it('should be named, html', () => assert.equal(attr.name, 'html'));
    it('should have the expected descriptor', () => assert.ok(!attr.descriptor));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
    it('should return a cleanup func for into', t => assert.equal('function', typeof attr.processor.into({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });

  describe('prop', () => {
    let attr = attributes[5];
    it('should be named, prop', () => assert.equal(attr.name, 'prop'));
    it('should have the expected descriptor', () => assert.deepEqual(attr.descriptor, { reqLeft: true }));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
    it('should return a cleanup func for into', t => assert.equal('function', typeof attr.processor.into({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });

  describe('show', () => {
    let attr = attributes[6];
    it('should be named, show', () => assert.equal(attr.name, 'show'));
    it('should have the expected descriptor', () => assert.ok(!attr.descriptor));
    it('should have 1 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
    it('should return a cleanup func for into', t => assert.equal('function', typeof attr.processor.into({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });
  
  describe('style', () => {
    let attr = attributes[7];
    it('should be named, style', () => assert.equal(attr.name, 'style'));
    it('should have the expected descriptor', () => assert.deepEqual(attr.descriptor, { reqLeft: true }));
    it('should have 2 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
    it('should return a cleanup func for into', t => assert.equal('function', typeof attr.processor.into({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });

  describe('text', () => {
    let attr = attributes[8];
    it('should be named, text', () => assert.equal(attr.name, 'text'));
    it('should have the expected descriptor', () => assert.ok(!attr.descriptor));
    it('should have 2 processor', () => assert.equal(Object.keys(attr.processor).length, 2));
    it('should have an "as" processor', () => assert.ok('as' in attr.processor));
    it('should have an "into" processor', () => assert.ok('into' in attr.processor));
    it('should return a cleanup func for as', t => assert.equal('function', typeof attr.processor.as({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
    it('should return a cleanup func for into', t => assert.equal('function', typeof attr.processor.into({ elem: mockElem(t), expObj: { right: 'alias' }, map: {} })));
  });
});

