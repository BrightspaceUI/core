# Alerts

## d2l-alert

The `d2l-alert` component can be used to communicate important information relating to the state of the system and the users’ work flow.

![screenshot of a basic alert](./screenshots/alert.png)

```html
<script type="module">
	import '@brightspace-ui/core/components/alert/alert.js';
</script>

<d2l-alert type="default" button-text="Undo" has-close-button>
	A message.
</d2l-alert>
```

**Properties:**

- `button-text` (optional, String): text that is displayed within the alert's action button. If no text is provided the button is not displayed.
- `has-close-button` (Boolean, default: `false`) gives the alert a close button that will close the alert when clicked.
- `hidden` (Boolean, default: `false`): Whether or not the alert is currently visible.
- `subtext` (optional, String) The text that is displayed below the main alert message.
- `type` (String, default: `'default'`): type of the alert being displayed. Can be one of  `default`, `critical`, `success` , `warning`

**Events:**
* `d2l-alert-closed`: dispatched when the alert's close button is clicked
* `d2l-alert-button-pressed`: dispatched when the alert's action button is clicked

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
