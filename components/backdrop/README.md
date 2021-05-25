# Backdrop

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

## How to Use

Set the visible state of the backdrop by using the `shown` attribute/property.

```javascript
button.addEventListener('click', () => {
  backdrop.shown = !backdrop.shown;
});
```

`slow-transition` can be used on the `d2l-backdrop` element in order to increase the fade transition time to 1200ms (default is 200ms).
