
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { JSDOM } from 'jsdom';

import { binded } from '../src/binded.mjs';

describe('HTML', () => {
  describe('binded-attr', () => {
    it('should read the binded attr', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div foo="bar" binded-attr="foo as test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      assert.equal(app.test, 'bar');
      assert.equal(dom.window.document.body.firstChild.getAttribute('foo'), 'bar');
    });
    
    it('should write the binded prop', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div foo="bar" binded-attr="foo as test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = 'baz';
      assert.equal(app.test, 'baz');
      assert.equal(dom.window.document.body.firstChild.getAttribute('foo'), 'baz');
    });

    it('should throw when the left-operand is missing', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div foo="bar" binded-attr="as test"/></body>');
      assert.throws(() => binded.init(dom.window.document.body));
    });
  });

  describe('binded-event', () => {
    const context = {
      event: {
        save: () => null,
      }
    };

    it('should throw when an invalid attribute is specified', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="save on click.me">SAVE</div></body>');
      assert.throws(() => binded.init(dom.window.document.body, { context }));
    });

    it('should not throw when a valid attribute is specified', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="save on click.stop">SAVE</div></body>');
      assert.doesNotThrow(() => binded.init(dom.window.document.body, { context }));
    });

    it('should throw when the left-operand is missing', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="on click">SAVE</div></body>');
      assert.throws(() => binded.init(dom.window.document.body, { context }));
    });
  });

  describe('binded-prop', () => {
    it('should read the binded prop', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><input value="bar" binded-prop="value as foo"/></body>');
      const { app } = binded.init(dom.window.document.body);
      assert.equal(app.foo, 'bar');
      assert.equal(dom.window.document.body.firstChild.value, 'bar');
    });
    
    it('should write the binded prop', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><input value="bar" binded-prop="value as foo"/></body>');
      const { app } = binded.init(dom.window.document.body);
      app.foo = 'baz';
      assert.equal(app.foo, 'baz');
      assert.equal(dom.window.document.body.firstChild.value, 'baz');
    });

    it('should throw when the left-operand is missing', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><input value="bar" binded-prop="as foo"/></body>');
      assert.throws(() => binded.init(dom.window.document.body));
    });
  });

  describe('binded-text', () => {
    it('should read the binded text', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-text="as test">HELLO</div></body>');
      const { app } = binded.init(dom.window.document.body);
      assert.equal(app.test, 'HELLO');
      assert.equal(dom.window.document.body.firstChild.textContent, 'HELLO');
    });
    
    it('should write the binded text', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-text="as test">HELLO</div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = 'WORLD';
      assert.equal(app.test, 'WORLD');
      assert.equal(dom.window.document.body.firstChild.textContent, 'WORLD');
    });
  });
});

