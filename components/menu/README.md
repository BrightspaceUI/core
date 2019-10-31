# Menu

## d2l-menu

A basic menu can be defined using `d2l-menu` and a combination of menu items (e.g., `d2l-menu-item`, `d2l-menu-item-separator`).  **Important**: specify a label on your `d2l-menu` for screen-readers.

![Menu](./screenshots/menu.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/menu/d2l-menu.js';
</script>

<d2l-menu label="Astronomy">
  <d2l-menu-item text="Introduction"></d2l-menu-item>
  <d2l-menu-item-separator></d2l-menu-item-separator>
  <d2l-menu-item text="Searching the Heavens"></d2l-menu-item>
  <d2l-menu-item text="The Solar System"></d2l-menu-item>
  <d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
  <d2l-menu-item text="The Night Sky"></d2l-menu-item>
  <d2l-menu-item text="The Universe"></d2l-menu-item>
</d2l-menu>
```

**Properties:**

* `label` (required, String): Text to be applied to menu `aria-label` for use with screen readers

**Events:**

* `d2l-menu-resize`: dispatched when size of menu changes (e.g., when nested menu of a different size is opened)

**Note:** `d2l-menu` renders without an outer border since it's typically used in a context where a containing element defines a border (ex. `d2l-dropdown-menu` or side nav).

## Menu Items

By default, there are several menu item types provided. These include `d2l-menu-item` (for JS handlers), `d2l-menu-item-link` (for navigating), and `d2l-menu-item-checkbox`/`d2l-menu-item-radio` (for selection).

While navigation can be done in JS too, `d2l-menu-item-link` gives users the ability to right-click and open in a new tab.  If providing a JS handler, wire-up to the `d2l-menu-item-select` event.  In addition, a `d2l-menu-item-separator` can be used to semantically separate menu items.

![Menu Items](./screenshots/menu-items.png?raw=true)

```html
<d2l-menu label="Astronomy">
  <d2l-menu-item text="Introduction"></d2l-menu-item>
  <d2l-menu-item text="The Planets"></d2l-menu-item>
  <d2l-menu-item-separator></d2l-menu-item-separator>
  <d2l-menu-item-link text="The Universe" href="https://en.wikipedia.org/wiki/Universe"></d2l-menu-item-link>
</d2l-menu>
```

```javascript
menu.addEventListener('d2l-menu-item-select', function(e) {
	console.log('item selected:', e.target);
});
```

**Properties (d2l-menu-item, d2l-menu-item-link, d2l-menu-item-checkbox, d2l-menu-item-radio):**

* `text` (required, String): text displayed by the menu item
* `disabled` (Boolean): disables the menu item

**Properties (d2l-menu-item-link):**

* `href` (required, String): the url the menu item link navigates to
* `prevent-default` (Boolean): Disables normal link behavior.  This can help if you want both a JS handler and the browser's 'open in new tab' functionality (e.g. popup window links).

**Events:**

* `d2l-menu-item-select`: dispatched when a menu item is selected

### Selection Menu Items (radio/checkbox)

The selection menu items act as you would expect a checkbox or radio item to act. Multiple checkboxes in the same menu may be selected, but only one radio item in a given `<d2l-menu>` may be selected at once (i.e. selecting one option will deselect all the other `d2l-menu-item-radio` items).

![Checkbox Menu](./screenshots/checkbox-menu.png?raw=true)

```html
<d2l-menu label="Some Options">
  <d2l-menu-item-checkbox text="Option 1" value="1"></d2l-menu-item-checkbox>
  <d2l-menu-item-checkbox text="Option 2" value="2"></d2l-menu-item-checkbox>
  <d2l-menu-item-checkbox text="Option 3" value="3"></d2l-menu-item-checkbox>
</d2l-menu>
```

![Radio Menu](./screenshots/radio-menu.png?raw=true)

```html
<d2l-menu label="Some Options">
  <d2l-menu-item-radio text="Option 1" value="1" selected></d2l-menu-item-radio>
  <d2l-menu-item-radio text="Option 2" value="2"></d2l-menu-item-radio>
  <d2l-menu-item-radio text="Option 3" value="3"></d2l-menu-item-radio>
</d2l-menu>
```

**Properties:**

* `value` (required, String):
* `selected` (Boolean): this will set the item to be selected by default.

**Events:**

* `d2l-menu-item-change`: dispatched when the selected menu item changes

## Nested Menus

Nested menus can be defined by placing a `d2l-menu` inside a `d2l-menu-item`.  For nested menus, a `label` attribute is automatically applied using the text attribute of the `d2l-menu-item` that contains it - no need to duplicate this value.  A "return" menu item will be added to the top of the nested menu by default.

![Nested Menu](./screenshots/nested-menu.png?raw=true)

```html
<d2l-menu label="Astronomy">
  <d2l-menu-item text="Introduction"></d2l-menu-item>
  <d2l-menu-item-separator></d2l-menu-item-separator>
  <d2l-menu-item text="Searching the Heavens"></d2l-menu-item>
  <d2l-menu-item text="The Solar System">
    <d2l-menu>
      <d2l-menu-item text="Formation"></d2l-menu-item>
      <d2l-menu-item text="Modern Solar System"></d2l-menu-item>
      <d2l-menu-item text="The Planets">
        <d2l-menu>
          <d2l-menu-item text="Mercury"></d2l-menu-item>
          <d2l-menu-item text="Venus"></d2l-menu-item>
          <d2l-menu-item text="Earth"></d2l-menu-item>
          <d2l-menu-item text="Mars"></d2l-menu-item>
          <d2l-menu-item text="..."></d2l-menu-item>
        </d2l-menu>
      </d2l-menu-item>
      <d2l-menu-item text="The Sun"></d2l-menu-item>
      <d2l-menu-item text="Asteroids"></d2l-menu-item>
      <d2l-menu-item text="Comets"></d2l-menu-item>
    </d2l-menu>
  </d2l-menu-item>
  <d2l-menu-item text="Stars &amp; Galaxies">
    <d2l-menu>
      <d2l-menu-item text="What is a Star?"></d2l-menu-item>
      <d2l-menu-item text="Lifecycle of a Star"></d2l-menu-item>
      <d2l-menu-item text="Binaries &amp; Multiples"></d2l-menu-item>
      <d2l-menu-item text="Star Clusters"></d2l-menu-item>
      <d2l-menu-item text="Star Death"></d2l-menu-item>
      <d2l-menu-item text="Galaxies"></d2l-menu-item>
    </d2l-menu>
  </d2l-menu-item>
  <d2l-menu-item text="The Night Sky"></d2l-menu-item>
</d2l-menu>
```
