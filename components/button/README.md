# Buttons

## d2l-button-subtle
![Subtle Button](./screenshots/button-subtle.png?raw=true)
![Hovered Subtle Button](./screenshots/button-subtle-hover.png?raw=true)
![Focused Subtle Button](./screenshots/button-subtle-focus.png?raw=true)

### Usage

```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-subtle.js';
</script>
<d2l-button-subtle text="My Button" icon="d2l-tier1:gear"></d2l-button-subtle>
```

The `d2l-button-subtle` element can be used just like the native `button`, but for advanced or de-emphasized actions. It supports an optional `icon` attribute for including an icon, as well as `h-align` and `icon-right` attributes for controlling alignment.

*Note:* It is strongly recommended to use `text` and `icon` as opposed to putting content in the `slot` to ensure that the recommended subtle button style is maintained.

***Properties:***

* `text` (required): Text for the button
* `h-align` (optional): `text` aligns the leading edge of text
* `icon` (optional): Icon for the button (ex. `d2l-tier1:gear`)
* `icon-right` (optional): Indicates that the icon should be rendered on right
