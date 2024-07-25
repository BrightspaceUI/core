# Menu

A menu displays a list of choices or actions. They generally appear when the user interacts with a dropdown or button.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
  import '@brightspace-ui/core/components/menu/menu-item-checkbox.js';
  import '@brightspace-ui/core/components/menu/menu-item-radio.js';
  import '@brightspace-ui/core/components/menu/menu-item-separator.js';
</script>

<d2l-menu label="Example Menu">
  <d2l-menu-item text="Menu Item"></d2l-menu-item>
  <d2l-menu-item-separator></d2l-menu-item-separator>
  <d2l-menu-item-checkbox text="Checkbox Menu Item" value="1"></d2l-menu-item-checkbox>
  <d2l-menu-item-radio text="Radio Menu Item 1" value="2"></d2l-menu-item-radio>
  <d2l-menu-item-radio text="Radio Menu Item 2" value="3"></d2l-menu-item-radio>
</d2l-menu>
```

## Menu [d2l-menu]

A basic menu can be defined using `d2l-menu` and a combination of menu items (e.g., `d2l-menu-item`, `d2l-menu-item-separator`).

**Note:** `d2l-menu` renders without an outer border since it's typically used in a context where a containing element defines a border (ex. `d2l-dropdown-menu` or side nav).

<!-- docs: demo code properties name:d2l-menu sandboxTitle:'Menu' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
</script>

<d2l-menu label="Example Menu">
  <d2l-menu-item text="Menu Item 1"></d2l-menu-item>
  <d2l-menu-item text="Menu Item 2"></d2l-menu-item>
</d2l-menu>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `label` | String, required for root menu | Acts as the primary label for the menu |

### Events

* `d2l-menu-resize`: dispatched when size of menu changes (e.g., when nested menu of a different size is opened)
<!-- docs: end hidden content -->

## Menu Item [d2l-menu-item]

The `d2l-menu-item` component is used with JS handlers and can be wired-up to the `d2l-menu-item-select` event.

<!-- docs: demo code properties name:d2l-menu-item sandboxTitle:'Menu Item' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';

  window.addEventListener('load', function () {
    document.querySelector('#menu').addEventListener('d2l-menu-item-select', (e) => {
      console.log('item selected:', e.target);
    });
  });
</script>

<d2l-menu label="Example Menu" id="menu">
  <d2l-menu-item text="Example Menu Item 1"></d2l-menu-item>
  <d2l-menu-item text="Example Menu Item 2">
	<d2l-menu label="Nested Menu">
		<d2l-menu-item text="Nested Menu Item"></d2l-menu-item>
	</d2l-menu>
  </d2l-menu-item>
</d2l-menu>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed by the menu item |
| `description` | String | A description of the menu item that will be used by screen readers for additional context |
| `disabled` | Boolean | Disables the menu item |

### Events

* `d2l-menu-item-select`: dispatched when a menu item is selected

### Slots

* `supporting`: Allows supporting information to be displayed on the right-most side of the menu item
<!-- docs: end hidden content -->

## Link Menu Item [d2l-menu-item-link]

This `d2l-menu-item-link` is used for navigating. It gives users the ability to right-click and open in a new tab.

<!-- docs: demo code properties name:d2l-menu-item-link sandboxTitle:'Menu Item Link' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item-link.js';
</script>

<d2l-menu label="Menu with Link Menu Items">
  <d2l-menu-item-link text="Link Menu Item" href="https://www.d2l.com/" target="_blank"></d2l-menu-item-link>
  <d2l-menu-item-link text="Second Link Menu Item" href="https://www.d2l.com/" target="_blank"></d2l-menu-item-link>
</d2l-menu>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `href` | String, required | The URL the menu item link navigates to |
| `text` | String, required | Text displayed by the menu item |
| `description` | String | A description of the menu item that will be used by screen readers for additional context |
| `disabled` | Boolean | Disables the menu item |
| `download` | String | If the attribute is provided, it will prompt the user to download the resource instead of navigating to it. Additionally, if the attribute is provided with a value, that value will be used for the filename. |
| `target` | String | Where to display the linked URL |

### Slots

* `supporting`: Allows supporting information to be displayed on the right-most side of the menu item
<!-- docs: end hidden content -->

## Checkbox Menu Item [d2l-menu-item-checkbox]

The `d2l-menu-item-checkbox` component is used for selection. It can be wired-up to the `d2l-menu-item-change` event. Multiple checkboxes can be selected at once.

<!-- docs: demo code properties name:d2l-menu-item-checkbox sandboxTitle:'Menu Item Checkbox' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item-checkbox.js';

  window.addEventListener('load', function () {
    document.querySelector('#menu-checkbox').addEventListener('d2l-menu-item-change', (e) => {
      console.log('item selection changed:', e.target);
    });
  });
</script>

<d2l-menu label="Menu with Checkbox Menu Items" id="menu-checkbox">
  <d2l-menu-item-checkbox text="Checkbox Option 1" value="1"></d2l-menu-item-checkbox>
  <d2l-menu-item-checkbox text="Checkbox Option 2" value="2"></d2l-menu-item-checkbox>
</d2l-menu>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed by the menu item |
| `value` | String, required | The selectable item's value |
| `description` | String | A description of the menu item that will be used by screen readers for additional context |
| `disabled` | Boolean | Disables the menu item |
| `selected` | Boolean | Thie will set the item to be selected by default |

### Slots

* `supporting`: Allows supporting information to be displayed on the right-most side of the menu item

### Events

* `d2l-menu-item-change`: dispatched when the selected menu item changes
<!-- docs: end hidden content -->

## Radio Menu Item [d2l-menu-item-radio]

The `d2l-menu-item-radio` component is used for selection. It can be wired-up to the `d2l-menu-item-change` event. Only one radio item in a given `<d2l-menu>` may be selected at once (i.e., selecting one option will deselect the other selected `d2l-menu-item-radio` item).

<!-- docs: demo code properties name:d2l-menu-item-radio sandboxTitle:'Menu Item Radio' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item-radio.js';

  window.addEventListener('load', function () {
    document.querySelector('#menu-radio').addEventListener('d2l-menu-item-change', (e) => {
      console.log('item selection changed:', e.target);
    });
  });
</script>

<d2l-menu label="Menu with Radio Menu Items" id="menu-radio">
  <d2l-menu-item-radio text="Radio Option 1" value="1"></d2l-menu-item-radio>
  <d2l-menu-item-radio text="Radio Option 2" value="2"></d2l-menu-item-radio>
</d2l-menu>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed by the menu item |
| `value` | String, required | The selectable item's value |
| `description` | String | A description of the menu item that will be used by screen readers for additional context |
| `disabled` | Boolean | Disables the menu item |
| `selected` | Boolean | This will set the item to be seelcted by default |

### Slots

* `supporting`: Allows supporting information to be displayed on the right-most side of the menu item

### Events

* `d2l-menu-item-change`: dispatched when the selected menu item changes
<!-- docs: end hidden content -->

## Separator Menu Item [d2l-menu-item-separator]

The `d2l-menu-item-separator` component can be used to semantically separate menu items.

<!-- docs: demo code properties name:d2l-menu-item-separator sandboxTitle:'Menu Item Separator' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
  import '@brightspace-ui/core/components/menu/menu-item-separator.js';
</script>

<d2l-menu label="Menu with Separator">
  <d2l-menu-item text="Menu Item 1"></d2l-menu-item>
  <d2l-menu-item-separator></d2l-menu-item-separator>
  <d2l-menu-item text="Menu Item 2"></d2l-menu-item>
</d2l-menu>
```

## Nested Menus

Nested menus can be defined by placing a `d2l-menu` inside a `d2l-menu-item`.  For nested menus, a `label` attribute is automatically applied using the text attribute of the `d2l-menu-item` that contains it - no need to duplicate this value.  A "return" menu item will be added to the top of the nested menu by default.

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
</script>

<d2l-menu label="Astronomy">
  <d2l-menu-item text="The Solar System">
    <d2l-menu>
      <d2l-menu-item text="The Sun"></d2l-menu-item>
      <d2l-menu-item text="The Planets">
        <d2l-menu>
          <d2l-menu-item text="Mercury"></d2l-menu-item>
          <d2l-menu-item text="Venus"></d2l-menu-item>
          <d2l-menu-item text="Earth"></d2l-menu-item>
        </d2l-menu>
      </d2l-menu-item>
      <d2l-menu-item text="Comets"></d2l-menu-item>
    </d2l-menu>
  </d2l-menu-item>
  <d2l-menu-item text="Stars &amp; Galaxies">
    <d2l-menu>
      <d2l-menu-item text="Lifecycle of a Star"></d2l-menu-item>
      <d2l-menu-item text="Galaxies"></d2l-menu-item>
    </d2l-menu>
  </d2l-menu-item>
  <d2l-menu-item text="The Night Sky"></d2l-menu-item>
</d2l-menu>
```

## ACCESSIBILITY

- The `label` property for `d2l-menu` is only required for the root menu
	- For nested menus, the label is automatically applied based on its parent menu-item
- The `d2l-menu` component and its items all follow W3C's [menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) pattern best practices
	- This includes the expected keyboard behaviour, which allows for seamless navigation within the menu and any submenus within it
