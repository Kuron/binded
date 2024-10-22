
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { JSDOM } from 'jsdom';

import { binded } from '../src/binded.mjs';

describe('HTML', () => {
  describe('binded-event', () => {
    it('should throw when an invalid attribute is specified', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="save on click.me">SAVE</div></body>');
      assert.throws(() => binded.init(dom.window.document.body, { context: { event: { save: () => null } } }));
    });

    it('should not throw when a valid attribute is specified', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="save on click.stop">SAVE</div></body>');
      assert.doesNotThrow(() => binded.init(dom.window.document.body, { context: { event: { save: () => null } } }));
    });
  });

  describe('binded-text', () => {
    it('should read the binded text', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-text="as test">HELLO</div></body>');
      const { app } = binded.init(dom.window.document.body);
      assert.equal(app.test, 'HELLO');
    });
    
    it('should write the binded text', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-text="as test">HELLO</div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = 'WORLD';
      assert.equal(app.test, 'WORLD');
    });
  });
});

