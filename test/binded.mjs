
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { binded } from '../src/binded.mjs';

describe('binded', () => {
  it('should have 5 methods', () => {
    assert.equal(Object.keys(binded).length, 5);
    assert.deepEqual(Object.keys(binded), ['init', 'createMap', 'findScope', 'inspectElem', 'parseBindedExp']);
  });

  describe('init', () => {
    // STUB
  });

  describe('createMap', () => {
    // STUB
  });

  describe('findScope', () => {
    // STUB
  });

  describe('inspectElem', () => {
    // STUB
  });

  describe('parseBindedExp', () => {
    describe('failures', () => {
      it('should be empty with no args', () => assert.deepEqual(binded.parseBindedExp(), []));
      it('should be empty with undefined', () => assert.deepEqual(binded.parseBindedExp(undefined), []));
      it('should be empty with null', () => assert.deepEqual(binded.parseBindedExp(null), []));
      it('should be empty with an empty str', () => assert.deepEqual(binded.parseBindedExp(''), []));
      it('should be empty with an space-only str', () => assert.deepEqual(binded.parseBindedExp('  '), []));
    
      it('should be empty with 1 token', () => assert.deepEqual(binded.parseBindedExp('tok1'), []));
      it('should be empty with 1 only a valid operator', () => assert.deepEqual(binded.parseBindedExp('as'), []));
      it('should be empty with 4 token (1)', () => assert.deepEqual(binded.parseBindedExp('tok1 tok2 as tok3'), []));
      it('should be empty with 4 token (2)', () => assert.deepEqual(binded.parseBindedExp('tok1 as tok2 tok3'), []));
      
      it('should be empty with an invalid ident (1)', () => assert.deepEqual(binded.parseBindedExp('1tok as 2tok'), []));
      it('should be empty with an invalid ident (2)', () => assert.deepEqual(binded.parseBindedExp('$tok1 as $tok2'), []));
      it('should be empty with an invalid ident (3)', () => assert.deepEqual(binded.parseBindedExp('_tok1 as _tok2'), []));
      it('should be empty with an invalid ident (4)', () => assert.deepEqual(binded.parseBindedExp('-tok1 as itok2'), []));
      
      it('should be empty with an invalid op (1)', () => assert.deepEqual(binded.parseBindedExp('tok1 op tok2'), []));
      it('should be empty with an invalid op (2)', () => assert.deepEqual(binded.parseBindedExp('tok1 $as tok2'), []));
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
    });
  });
});

