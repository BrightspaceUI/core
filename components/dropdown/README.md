# Dropdowns

A Dropdown is a component which is used to open a content overlay.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-context-menu.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-tabs.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-dropdown-button text="Open!">
  <d2l-dropdown-content>
    Some content...
  </d2l-dropdown-content>
</d2l-dropdown-button>

<d2l-dropdown-button-subtle text="Open!">
  <d2l-dropdown-tabs min-width="175" max-width="300">
    <d2l-tabs>
      <d2l-tab-panel text="first">first content</d2l-tab-panel>
      <d2l-tab-panel text="second">second content</d2l-tab-panel>
    </d2l-tabs>
  </d2l-dropdown-tabs>
</d2l-dropdown-button-subtle>

<d2l-dropdown-context-menu text="Open!">
  <d2l-dropdown-menu id="dropdown">
    <d2l-menu label="Astronomy">
      <d2l-menu-item text="Introduction"></d2l-menu-item>
      <d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
      <d2l-menu-item text="The Solar System">
    </d2l-menu>
  </d2l-dropdown-menu>
</d2l-dropdown-context-menu>

<d2l-dropdown-more text="Open!">
  <d2l-dropdown-content>
    Some content...
  </d2l-dropdown-content>
</d2l-dropdown-more>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to collapse a number of related actions into a single entry point.
* Use short verbs or verb phrases as text.
* The primary style is very juicy; in general there should be at most one primary button or dropdown on a given page.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use a dropdown as entry point for navigation.
* Dropdowns never contain an icon (other than the chevron). The exception is the “dots” menu handle (link coming soon).
* Don't include ellipses (…) in the label text.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Dropdown Openers

### Dropdown

`d2l-dropdown` is a generic opener for dropdown content (`d2l-dropdown-content`, `d2l-dropdown-menu` or `d2l-dropdown-tabs`) enabling alternate opener implementation using existing elements/components. Provide and indicate your own opener element with the class attribute value `d2l-dropdown-opener`.  Wire-up is automatic.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
</script>

<d2l-dropdown>
  <button class="d2l-dropdown-opener">Open!</button>
  <d2l-dropdown-content>
    Some content...
  </d2l-dropdown-content>
</d2l-dropdown>
```

**How to Use:**

If the dropdown is initially empty when it's opened, the dropdown pointer will not be positioned correctly.  In such cases, the `no-auto-open` attribute may be added to the opener, enabling you to take control of when the dropdown is actually opened:

```html
<d2l-dropdown no-auto-open>
  ...
</d2l-dropdown>
```

```javascript
dropdown.addEventListener('click', function() {
  // fetch some content
  ...
  // take control of when the dropdown is actually opened
  dropdown.toggleOpen();
});
```

### Dropdown Button

`d2l-dropdown-button` is a `d2l-button` opener for dropdown content (`d2l-dropdown-content`, `d2l-dropdown-menu` or `d2l-dropdown-tabs`).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
</script>

<d2l-dropdown-button text="Open!">
  <d2l-dropdown-content>
    Some content...
  </d2l-dropdown-content>
</d2l-dropdown-button>
```

### Dropdown Button Subtle

`d2l-dropdown-button-subtle` is a `d2l-button-subtle` opener for dropdown content (`d2l-dropdown-content`, `d2l-dropdown-menu` or `d2l-dropdown-tabs`).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
</script>

<d2l-dropdown-button-subtle text="Open!">
  <d2l-dropdown-content>
    Some content...
  </d2l-dropdown-content>
</d2l-dropdown-button-subtle>
```

**Accessibility:**

To make your `d2l-dropdown-button-subtle` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `description` | Use when text on button does not provide enough context. |

### Dropdown Context Menu

`d2l-dropdown-context-menu` is a simple/minimal opener for dropdown content (`d2l-dropdown-content`, `d2l-dropdown-menu` or `d2l-dropdown-tabs`).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-context-menu.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
</script>

<d2l-dropdown-context-menu text="Open!">
  <d2l-dropdown-content>
    Some content...
  </d2l-dropdown-content>
</d2l-dropdown-context-menu>
```

**Accessibility:**

To make your usage of `d2l-dropdown-context-menu` accessible, use the following property:

| Attribute | Description |
|--|--|
| `text` | Acts as a primary label and tooltip and is **REQUIRED**. |

### Dropdown More

`d2l-dropdown-more` is a simple/minimal opener for dropdown content (`d2l-dropdown-content`, `d2l-dropdown-menu` or `d2l-dropdown-tabs`).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
</script>

<d2l-dropdown-more text="Open!">
  <d2l-dropdown-content>
    Some content...
  </d2l-dropdown-content>
</d2l-dropdown-more>
```

**Accessibility:**

To make your usage of `d2l-dropdown-more` accessible, use the following property:

| Attribute | Description |
|--|--|
| `text` | Acts as a primary label and tooltip and is **REQUIRED**. |

## Dropdown Contents

### Dropdown Content

`d2l-dropdown-content` is a generic container for dropdown content.  It provides behavior such as sizing,  positioning, and managing focus gain/loss.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
</script>

<d2l-dropdown-button text="Open!" primary>
  <d2l-dropdown-content min-width="150" max-width="400">
    <a href="https://www.google.com">Google</a>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <a href="http://www.desire2learn.com">D2L</a>
  </d2l-dropdown-content>
</d2l-dropdown-button>
```

**Methods:**
* `async resize()`: Call if the size of the content changes due to a change in
a nested component. The nested component may choose to fire a custom event, which
the component containing the `d2l-dropdown-content` can catch and call this method.

```html
<d2l-dropdown-content min-width="150" max-width="400">
  <div slot="header">Header Content</div>
  Some Content...
  <div slot="footer">Footer Content</div>
</d2l-dropdown-content>
```

### Dropdown Menu

`d2l-dropdown-menu` is a container for a `d2l-menu` component. It provides additional support on top of `d2l-dropdown-content` for closing the menu when menu items are selected, resetting to the root of nested menus when reopening and automatic resizing when the menu resizes.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
</script>

<d2l-dropdown-button text="Open!" primary>
  <d2l-dropdown-menu id="dropdown">
    <d2l-menu label="Astronomy">
      <d2l-menu-item text="Introduction"></d2l-menu-item>
      <d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
      <d2l-menu-item text="The Solar System">
        <d2l-menu>
          <d2l-menu-item text="Formation"></d2l-menu-item>
          <d2l-menu-item text="Modern Solar System"></d2l-menu-item>
          <d2l-menu-item text="Future Solar System"></d2l-menu-item>
          <d2l-menu-item text="The Planets"></d2l-menu-item>
          <d2l-menu-item text="The Sun"></d2l-menu-item>
          <d2l-menu-item text="Solar &amp; Lunar Eclipses"></d2l-menu-item>
          <d2l-menu-item text="Meteors &amp; Meteorites"></d2l-menu-item>
          <d2l-menu-item text="Asteroids"></d2l-menu-item>
          <d2l-menu-item text="Comets"></d2l-menu-item>
        </d2l-menu>
      </d2l-menu-item>
      <d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
      <d2l-menu-item text="The Night Sky"></d2l-menu-item>
      <d2l-menu-item text="The Universe"></d2l-menu-item>
    </d2l-menu>
  </d2l-dropdown-menu>
</d2l-dropdown-button>
```

### Dropdown Tabs

`d2l-dropdown-tabs` is a container for a `d2l-tabs` component. It provides additional support on top of `d2l-dropdown-content` for automatic resizing when the tab changes.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-tabs.js';
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
  import '@brightspace-ui/core/components/tabs/tabs.js';
  import '@brightspace-ui/core/components/tabs/tab-panel.js';
</script>

<d2l-dropdown-button text="Open!" primary>
  <d2l-dropdown-tabs min-width="175" max-width="300">
    <d2l-tabs>
      <d2l-tab-panel text="first">first content</d2l-tab-panel>
      <d2l-tab-panel text="second">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </d2l-tab-panel>
      <d2l-tab-panel text="third">
        <d2l-menu label="Astronomy">
          <d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
          <d2l-menu-item text="The Universe"></d2l-menu-item>
        </d2l-menu>
      </d2l-tab-panel>
      <d2l-tab-panel text="fourth">fourth content</d2l-tab-panel>
      <d2l-tab-panel text="fifth">fifth content</d2l-tab-panel>
      <d2l-tab-panel text="sixth">sixth content</d2l-tab-panel>
    </d2l-tabs>
  </d2l-dropdown-tabs>
</d2l-dropdown-button>
```
