# Loading Spinners

The loading spinner can be used to indicate to a user that the current page/component is in a loading state, potentially when waiting for asynchronous data or during rendering.
<!-- docs: demo name:d2l-loading-spinner -->
```html
<script type="module">
  import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
</script>

<d2l-loading-spinner></d2l-loading-spinner>
```
<!-- docs: start hidden content -->
![Loading Spinner](./screenshots/loading-spinner.gif?raw=true)
<!-- docs: end hidden content -->

## Loading Spinner [d2l-loading-spinner]

<!-- docs: demo live name:d2l-loading-spinner -->
```html
<script type="module">
  import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
</script>

<d2l-loading-spinner></d2l-loading-spinner>
```
<!-- docs: start hidden content -->

### Properties:

| Property | Type | Description |
|--|--|--|
| `color` | String | Color of the animated bar (default is `--d2l-color-celestine`) |
| `size` | Number, default: `50` | Height and width (`px`) of the spinner |

## Future Enhancements

- Ability to "freeze" the spinner at a specified frame to make visual diff testing easier

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
