# Buttons

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
* `translucent` (optional): Indicated to display translucent (ex. on rich backgrounds)
