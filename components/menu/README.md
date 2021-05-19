# Menus

A menu displays a list of choices or actions. They generally appear when the user interacts with a dropdown or button.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
  import '@brightspace-ui/core/components/menu/menu-item-checkbox.js';
  import '@brightspace-ui/core/components/menu/menu-item-radio.js';
  import '@brightspace-ui/core/components/menu/menu-item-separator.js';
</script>

<d2l-menu label="Astronomy">
  <d2l-menu-item text="MenuItem"></d2l-menu-item>
  <d2l-menu-item-separator></d2l-menu-item-separator>
  <d2l-menu-item-checkbox text="Checkbox Menu Item"></d2l-menu-item-checkbox>
  <d2l-menu-item-radio text="Radio Menu Item 1"></d2l-menu-item-radio>
  <d2l-menu-item-radio text="Radio Menu Item 2"></d2l-menu-item-radio>
</d2l-menu>
```

## Menu

A basic menu can be defined using `d2l-menu` and a combination of menu items (e.g., `d2l-menu-item`, `d2l-menu-item-separator`).  **Important**: specify a label on your `d2l-menu` for screen-readers.

**Note:** `d2l-menu` renders without an outer border since it's typically used in a context where a containing element defines a border (ex. `d2l-dropdown-menu` or side nav).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
  import '@brightspace-ui/core/components/menu/menu-item-separator.js';
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

### Accessibility

To make your usage of `d2l-menu` accessible, use the following property:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** Acts as a primary label for the menu |

## Menu Items

By default, there are several menu item types provided. These include `d2l-menu-item` (for JS handlers), `d2l-menu-item-link` (for navigating), and `d2l-menu-item-checkbox`/`d2l-menu-item-radio` (for selection).

While navigation can be done in JS too, `d2l-menu-item-link` gives users the ability to right-click and open in a new tab.  If providing a JS handler, wire-up to the `d2l-menu-item-select` event.  In addition, a `d2l-menu-item-separator` can be used to semantically separate menu items.

```html
<d2l-menu label="Astronomy">
  <d2l-menu-item text="Introduction"></d2l-menu-item>
  <d2l-menu-item text="The Planets" disabled></d2l-menu-item>
  <d2l-menu-item-separator></d2l-menu-item-separator>
  <d2l-menu-item-link text="The Universe" href="https://en.wikipedia.org/wiki/Universe"></d2l-menu-item-link>
</d2l-menu>
```

### Menu Item

This is used with JS handlers and can be wired-up to the `d2l-menu-item-select` event.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
</script>
<script>
  document.querySelector('#menu').addEventListener('d2l-menu-item-select', (e) => {
    console.log('item selected:', e.target);
  });
</script>

<d2l-menu label="Astronomy" id="menu">
	<d2l-menu-item text="Introduction"></d2l-menu-item>
</d2l-menu>
```

### Link Menu Item

The link menu item is used for navigating.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item-link.js';
</script>

<d2l-menu label="Astronomy">
  <d2l-menu-item-link text="The Universe" href="https://en.wikipedia.org/wiki/Universe"></d2l-menu-item-link>
</d2l-menu>
```

### Checkbox Menu Item

The checkbox menu item is used for selection. This can be wired-up to the `d2l-menu-item-change` event. Multiple checkboxes can be selected at once.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item-checkbox.js';
</script>
<script>
  document.querySelector('#menu-checkbox').addEventListener('d2l-menu-item-change', (e) => {
    console.log('item selection changed:', e.target);
  });
</script>

<d2l-menu label="Some Options" id="menu-checkbox">
  <d2l-menu-item-checkbox text="Option 1" value="1"></d2l-menu-item-checkbox>
  <d2l-menu-item-checkbox text="Option 2" value="2"></d2l-menu-item-checkbox>
</d2l-menu>
```

### d2l-menu-item-radio

The radio menu item, `d2l-menu-item-radio`, is used for selection. This can be wired-up to the `d2l-menu-item-change` event. Only one radio item in a given `<d2l-menu>` may be selected at once (i.e., selecting one option will deselect the other selected `d2l-menu-item-radio` item).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item-radio.js';
</script>
<script>
  document.querySelector('#menu-radio').addEventListener('d2l-menu-item-change', (e) => {
    console.log('item selection changed:', e.target);
  });
</script>

<d2l-menu label="Some Options" id="menu-radio">
  <d2l-menu-item-radio text="Option 1" value="1" selected></d2l-menu-item-radio>
  <d2l-menu-item-radio text="Option 2" value="2"></d2l-menu-item-radio>
</d2l-menu>
```

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
