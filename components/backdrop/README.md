# Backdrop

## d2l-backdrop

The `d2l-backdrop` element is a web component to display a semi-transparent backdrop behind a specified sibling element. It also hides elements other than the target from assistive technologies by applying `role="presentation"` and `aria-hidden="true"`.

```html
<script type="module">
  import '@brightspace-ui/core/components/backdrop/backdrop.js';
</script>
<style>
  #target { position: relative; z-index: 1000; }
</style>

<div id="target"><button>toggle backdrop</button></div>
<d2l-backdrop for-target="target" shown></d2l-backdrop>
```

Set the visible state of the backdrop by using the `shown` attribute/property.

```javascript
button.addEventListener('click', () => {
  backdrop.shown = !backdrop.shown;
});
```

**Backdrop Properties:**

- `for-target` (required, String): id of the target element to display backdrop behind
- `shown` (Boolean): used to control whether the backdrop is shown
- `slow-transition` (Boolean): Increases the fade transition time to 1200ms (default is 200ms)
- `cut-out` (Boolean): disables the fade-out transition while the backdrop is being hidden

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
