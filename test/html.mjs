
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { JSDOM } from 'jsdom';

import { binded } from '../src/binded.mjs';

describe('HTML', () => {
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

