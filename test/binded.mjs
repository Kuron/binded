
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { JSDOM } from 'jsdom';

import { binded } from '../src/binded.mjs';

describe('binded', () => {
  it('should have 5 methods', () => {
    assert.equal(Object.keys(binded).length, 5);
    assert.deepEqual(Object.keys(binded), ['init', 'createMap', 'findScope', 'inspectElem', 'parseBindedExp']);
  });

  describe('init', () => {
    it('should find the scope from the specified elem', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-text="as test"></div></body>');
      const bindings = binded.init(dom.window.document.body);
      assert.ok('app' in bindings);
    });

    it('should find the scope from a child elem', () => {
      const dom = new JSDOM('<!doctype html><body><div binded-scope="as app"><div binded-text="as test"></div></div></body>');
      const bindings = binded.init(dom.window.document.body);
      assert.ok('app' in bindings);
    });
  });

  describe('createMap', () => {
    it('should return a map and proxyMap', () => {
      const ret = binded.createMap();
      assert.ok('map' in ret);
      assert.ok('proxyMap' in ret);
    });
  });

  describe('findScope', () => {
    // STUB
  });

  describe('inspectElem', () => {
    // STUB
  });

  describe('parseBindedExp', () => {
    describe('failures', () => {
      it('should throw with no args', () => assert.throws(() => binded.parseBindedExp()));
      it('should throw with undefined', () => assert.throws(() => binded.parseBindedExp(undefined)));
      it('should throw with null', () => assert.throws(() => binded.parseBindedExp(null)));
      it('should throw with an empty str', () => assert.throws(() => binded.parseBindedExp('')));
      it('should throw with an space-only str', () => assert.throws(() => binded.parseBindedExp('  ')));
    
      it('should throw with 1 token', () => assert.throws(() => binded.parseBindedExp('tok1')));
      it('should throw with 1 only a valid operator', () => assert.throws(() => binded.parseBindedExp('as')));
      it('should throw with 4 token (1)', () => assert.throws(() => binded.parseBindedExp('tok1 tok2 as tok3')));
      it('should throw with 4 token (2)', () => assert.throws(() => binded.parseBindedExp('tok1 as tok2 tok3')));
      
      it('should throw with an invalid ident (1)', () => assert.throws(() => binded.parseBindedExp('1tok as 2tok')));
      it('should throw with an invalid ident (2)', () => assert.throws(() => binded.parseBindedExp('$tok1 as $tok2')));
      it('should throw with an invalid ident (3)', () => assert.throws(() => binded.parseBindedExp('_tok1 as _tok2')));
      it('should throw with an invalid ident (4)', () => assert.throws(() => binded.parseBindedExp('-tok1 as itok2')));
      it('should throw with an invalid ident (5)', () => assert.throws(() => binded.parseBindedExp(`${'t'.repeat(65)} as tok2`)));
      it('should throw with an invalid ident (6)', () => assert.throws(() => binded.parseBindedExp(`tok1 as ${'t'.repeat(65)}`)));
      
      it('should throw with an invalid attr (1)', () => assert.throws(() => binded.parseBindedExp('tok1.1attr as tok2')));
      it('should throw with an invalid attr (2)', () => assert.throws(() => binded.parseBindedExp('tok1 as tok2.2attr')));
      it('should throw with an invalid attr (3)', () => assert.throws(() => binded.parseBindedExp('tok1.1attr as tok2.2attr')));
      
      it('should throw with an invalid op (1)', () => assert.throws(() => binded.parseBindedExp('tok1 op tok2')));
      it('should throw with an invalid op (2)', () => assert.throws(() => binded.parseBindedExp('tok1 $as tok2')));
    });

    describe('success', () => {
      it('should be valid', () => assert.deepEqual(binded.parseBindedExp('tok1 as tok2'),
        [{ left: 'tok1', leftAttrs: [], operator: 'as', right: 'tok2', rightAttrs: [] }]));
      it('should be valid, no left-op', () => assert.deepEqual(binded.parseBindedExp('as tok2'),
        [{ left: null, leftAttrs: null, operator: 'as', right: 'tok2', rightAttrs: [] }]));
      it('should be valid, with attrs', () => assert.deepEqual(binded.parseBindedExp('tok1.lattr as tok2.rattr'),
        [{ left: 'tok1', leftAttrs: ['lattr'], operator: 'as', right: 'tok2', rightAttrs: ['rattr'] }]));
      it('should be valid, with multiple attrs', () => assert.deepEqual(binded.parseBindedExp('tok1.la1.la2 as tok2.ra1.ra2'),
        [{ left: 'tok1', leftAttrs: ['la1', 'la2'], operator: 'as', right: 'tok2', rightAttrs: ['ra1', 'ra2'] }]));
      
      it('should not throw with a left-operand of 64 len', () => assert.doesNotThrow(() => binded.parseBindedExp(`${'t'.repeat(64)} as tok2`)));
      it('should not throw with a right-operand of 64 len', () => assert.doesNotThrow(() => binded.parseBindedExp(`tok1 as ${'t'.repeat(64)}`)));
    });
  });
});

