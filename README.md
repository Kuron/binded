
# Binded.js

A lightweight JavaScript framework that handles DOM bindings for small projects.

Why? When you want to quickly experiment with small projects in vanilla JS, but don't want to write and handle DOM reference code. So, just markup the DOM and call ```binded.bind()``` to get all the references. 

## Install

```
npm install @kurons/binded
```

The bundle from ```node_modules/@kurons/binded/dist/binded.js``` can be loaded in a browser.

```html
<script src="<PATH>/binded.js"></script>
```

## Usage

Declares a scope. Multiple scopes can be declared. Scopes can be nested within another scope. There has to be at least one scope declared.

### Notes

* A declared scope cannot contain any other ```binded``` bindings; they will be ignored. 
* If there is a collision with the scope alias and another alias, the scope alias will take precedence.

```html
<div binded-scope="as app"></div>
```

Bind an element.

```html
<div binded-scope="as app">
  <form binded-elem="as searchForm"></form>
</div>
```

Bind a property.

```html
<div binded-scope="as app">
  <form binded-elem="as searchForm">
    <input type="search" binded-prop="value as search" />
  </form>
</div>
```

Bind another property.

```html
<div binded-scope="as app">
  <form binded-elem="as searchForm">
    <input
      type="search"
      binded-prop="value as search and disabled as turnOffSearch" />
  </form>
</div>
```

Bind multiple element properties.

```html
<div binded-scope="as app">
  <form binded-elem="as searchForm">
    <input
      type="search"
      binded-prop="value as search and disabled as turnOffSearch" />
    <button
      type="submit"
      binded-prop="disabled into disableAllButtons">
      Search
    </button>
    <button
      type="reset"
      binded-prop="disabled into disableAllButtons">
      Clear
    </button>
  </form>
</div>
```

Access references from JS.

```javascript
const { app } = binded.bind(document.body);
console.log(app.searchForm);
app.search = 'Example Search Text';
app.turnOffSearch = true;
app.disableAllButtons = true;
```

## Attributes

| Name | Notes | Example |
| ---- | ----- | ------- |
| ```binded-scope``` | Declares a scope | ```<div binded-scope="as name"></div>``` |
| ```binded-attr``` | Binds directly to an element's attribute | ```<input type="email" value="" binded-attr="value as email"/>``` |
| ```binded-elem``` | Binds an element. Generally, this reference should be avoided unless the element's content is rendered with DOM APIs. | ```<div binded-elem="as cardElem"></div>``` |
| ```binded-event``` | Binds a function as an event on an element. The ```prevent``` and ```stop``` event modifiers for ```preventDefault``` and ```stopPropagation``` is available and can be appended after the event name separated by ```.```. | ```<form binded-event="searchText on submit.prevent"></form>``` |
| ```binded-html``` | Binds to an element's ```innerHTML``` | ```<div binded-html="as sanitizedHTML"></div>``` |
| ```binded-prop``` | Binds to an element's property | ```<input type="search" binded-prop="as searchText"/>``` |
| ```binded-text``` | Binds to an element's ```innerText``` | ```<div binded-text="as safeHTML"></div>``` |

## API

```javascript
binded.bind(              // Binds an element and returns an object with the bindings.
                          //   * Can be called multiple times to process new bindings for a scope
                          //   * Assumes scope hierarchy has not changed when called multiple times
  document.body,          // There has to be at least 1 scope binded as a child in the specified element
  {
    attrPrefix: 'binded', // The attribute prefix, default is 'binded'
    context: {            // Context is needed for binded-event
      event: {
        searchText: event => console.log(event),
      }
    }
  }
);
```

## Expression

The expression is primarily used to keep the HTML readable and clear on what's being binded.

```
[<left-operand>[.<attribute>...]] <operator> <right-operand>[.<attribute>...] ["and" ...]
```




