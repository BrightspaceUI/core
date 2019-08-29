# Buttons

## d2l-button

The `d2l-button` element can be used just like the native button element, but also supports the primary attribute for denoting the primary button.

![Button](./screenshots/button.png?raw=true)

### Usage

```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
</script>
<d2l-button>My Button</d2l-button>
```

***Properties:***

* `description` (optional): A description to be added to the `button` for accessibility

## d2l-button-subtle

The `d2l-button-subtle` element can be used just like the native `button`, but for advanced or de-emphasized actions.

![Subtle Button](./screenshots/button-subtle.png?raw=true)

### Usage

```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-subtle.js';
</script>
<d2l-button-subtle text="My Button" icon="d2l-tier1:gear"></d2l-button-subtle>
```

*Note:* It is strongly recommended to use `text` and `icon` as opposed to putting content in the `slot` to ensure that the recommended subtle button style is maintained.

***Properties:***

* `text` (required): Text for the button
* `description` (optional): A description to be added to the `button` for accessibility
* `h-align` (optional): `text` aligns the leading edge of text
* `icon` (optional): Icon for the button (ex. `d2l-tier1:gear`)
* `icon-right` (optional): Indicates that the icon should be rendered on right

## d2l-button-icon

The `d2l-button-icon` element can be used just like the native `button`, for instances where only an icon is displayed.

![Icon Button](./screenshots/button-icon.png?raw=true)

### Usage

```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-icon.js';
</script>
<d2l-button-icon text="My Button" icon="d2l-tier1:gear"></d2l-button-icon>
```

***Properties:***

* `text` (required): Accessibly text for the button
* `icon` (required): Icon for the button (ex. `d2l-tier1:gear`)
* `h-align` (optional): `text` aligns the leading edge of text
* `translucent` (optional): Indicates to display translucent (ex. on rich backgrounds)

## d2l-floating-buttons

Floating workflow buttons behavior can be added by using the `<d2l-floating-buttons>` custom element. When the normal position of the workflow buttons is below the bottom edge of the viewport, they will dock at the bottom edge. When the normal position becomes visible, they will undock.

![Floating Buttons](./screenshots/floating-buttons.png?raw=true)

### Usage

```html
<script type="module">
  import '@brightspace-ui/core/components/button/floating-buttons.js';
  import '@brightspace-ui/core/components/button/button.js';
</script>
<p>Some content</p>
<d2l-floating-buttons>
	<d2l-button primary>Save</d2l-button>
	<d2l-button>Cancel</d2l-button>
</d2l-floating-buttons>
```

***Properties***

* `always-float` (optional): Indicates to display buttons as always floating
* `min-height` (optional): The minimum height of the viewport to display floating buttons at (where applicable). If viewport is less than `min-height`, buttons will never appear floating (unless `always-float` is used). If viewport is greater than `min-height` then buttons will float when applicable.
