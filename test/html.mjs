
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
    
    it('should write to the foo attr and textContent', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-attr="foo into test" binded-text="into test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = 'HELLO';
      assert.equal(dom.window.document.body.firstChild.getAttribute('foo'), 'HELLO');
      assert.equal(dom.window.document.body.firstChild.textContent, 'HELLO');
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

    it('should not throw when the left-operand is missing', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="on click">SAVE</div></body>');
      assert.doesNotThrow(() => binded.init(dom.window.document.body, { context }));
    });

    it('should throw when the listener is not defined', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="notDefinedListener on click">SAVE</div></body>');
      assert.throws(() => binded.init(dom.window.document.body));
      assert.throws(() => binded.init(dom.window.document.body, {}));
      assert.throws(() => binded.init(dom.window.document.body, { context: {} }));
      assert.throws(() => binded.init(dom.window.document.body, { context: { event: {} } }));
    });

    it('should not throw when a listener is not specified; will default to noop', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-event="on click">SAVE</div></body>');
      assert.doesNotThrow(() => binded.init(dom.window.document.body));
    });
  });

  describe('binded-hide', () => {
    it('should hide the element', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-hide="as test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = true;
      assert.equal(app.test, true);
      assert.equal(dom.window.document.body.firstChild.style.display, 'none');
    });
    
    it('should show the element', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-hide="as test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = false;
      assert.equal(app.test, false);
      assert.equal(dom.window.document.body.firstChild.style.display, 'revert');
    });
  });
  
  describe('binded-html', () => {
    it('should write to the title prop and innerHTML', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-prop="title into test" binded-html="into test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = 'HELLO';
      assert.equal(dom.window.document.body.firstChild.title, 'HELLO');
      assert.equal(dom.window.document.body.firstChild.innerHTML, 'HELLO');
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

    it('should not expose private props', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><input binded-prop="disabled into disableAll"/><input binded-prop="disabled into disableAll"/></body>');
      const { app } = binded.init(dom.window.document.body);
      assert.equal(app.$disableAll, undefined);
    });

    it('should throw when writing to private prop', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><input binded-prop="disabled into disableAll"/><input binded-prop="disabled into disableAll"/></body>');
      const { app } = binded.init(dom.window.document.body);
      assert.throws(() => app.$disableAll = true);
    });

    it('should throw when the left-operand is missing', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><input value="bar" binded-prop="as foo"/></body>');
      assert.throws(() => binded.init(dom.window.document.body));
    });
  });

  describe('binded-show', () => {
    it('should show the element', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-show="as test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = true;
      assert.equal(app.test, true);
      assert.equal(dom.window.document.body.firstChild.style.display, 'revert');
    });
    
    it('should hide the element', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-show="as test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = false;
      assert.equal(app.test, false);
      assert.equal(dom.window.document.body.firstChild.style.display, 'none');
    });
  });
  
  describe('binded-style', () => {
    it('should read the binded style color', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-style="color as test" style="color: red;"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      assert.equal(app.test, 'red');
      assert.equal(dom.window.document.body.firstChild.style.color, 'red');
    });
    
    it('should write the binded style color', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-style="color as test" style="color: red;"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = 'blue';
      assert.equal(app.test, 'blue');
      assert.equal(dom.window.document.body.firstChild.style.color, 'blue');
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
    
    it('should write to the title prop and textContent', () => {
      const dom = new JSDOM('<!doctype html><body binded-scope="as app"><div binded-prop="title into test" binded-text="into test"></div></body>');
      const { app } = binded.init(dom.window.document.body);
      app.test = 'HELLO';
      assert.equal(dom.window.document.body.firstChild.title, 'HELLO');
      assert.equal(dom.window.document.body.firstChild.textContent, 'HELLO');
    });
  });
});

