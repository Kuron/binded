
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { JSDOM } from 'jsdom';

import { binded } from '../src/binded.mjs';

describe('binded', () => {
  it('should have 6 methods', () => {
    assert.equal(Object.keys(binded).length, 6);
    assert.deepEqual(Object.keys(binded), ['init', 'createMap', 'findScope', 'cleanupElem', 'inspectElem', 'parseBindedExp']);
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
      assert.ok('test' in bindings.app);
    });

    it('should not throw when binding multiple time', () => {
      const dom = new JSDOM('<!doctype html><body><div binded-scope="as app"><div binded-text="as test"></div></div></body>');
      let bindings = binded.init(dom.window.document.body);
      assert.doesNotThrow(() => binded.init(dom.window.document.body));
      assert.ok('app' in bindings);
      assert.ok('test' in bindings.app);
      assert.equal(bindings.app.test, '');
    });
    
    it('should still bind after binding multiple time', () => {
      const dom = new JSDOM('<!doctype html><body><div binded-scope="as app"><div binded-text="as test"></div></div></body>');
      let bindings = binded.init(dom.window.document.body);
      bindings = binded.init(dom.window.document.body);
      bindings.app.test = 'hello world';
      assert.equal(bindings.app.test, 'hello world');
      assert.equal(dom.window.document.body.firstChild.firstChild.textContent, 'hello world');
    });

    it('should throw when an invalid attrPrefix is specified', () => {
      const dom = new JSDOM();
      assert.throws(() => binded.init(dom.window.document.body, { attrPrefix: 'has space' }));
      assert.throws(() => binded.init(dom.window.document.body, { attrPrefix: 'hasNumber9' }));
      assert.throws(() => binded.init(dom.window.document.body, { attrPrefix: 'has-dashes' }));
      assert.throws(() => binded.init(dom.window.document.body, { attrPrefix: 'has_underscores' }));
      assert.throws(() => binded.init(dom.window.document.body, { attrPrefix: ' hasLeadingSpace' }));
      assert.throws(() => binded.init(dom.window.document.body, { attrPrefix: 'hasTrailingSpace ' }));
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

  describe('cleanupElem', () => {
    // STUB
  });

  describe('inspectElem', () => {
    it('should be binded by prop', () => {
      const dom = new JSDOM('<!doctype html><body><div binded-scope="as app"><input value="test"/></div></body>');
      dom.window.document.body.firstChild.firstChild.bindedProp = 'value as search';
      const { app } = binded.init(dom.window.document.body);
      assert.ok('search' in app);
      assert.equal(app.search, 'test');
    });
    
    it('should be able to write when binded by prop', () => {
      const dom = new JSDOM('<!doctype html><body><div binded-scope="as app"><input value="test"/></div></body>');
      dom.window.document.body.firstChild.firstChild.bindedProp = 'value as search';
      const { app } = binded.init(dom.window.document.body);
      app.search = 'testing';
      assert.equal(dom.window.document.body.firstChild.firstChild.value, 'testing');
    });

    it('should not throw when using a reserved event context with no context specified', () => {
      const dom = new JSDOM('<!doctype html><body><div binded-scope="as app"><input binded-event="on change"/></div></body>');
      assert.doesNotThrow(() => binded.init(dom.window.document.body));
    });
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

