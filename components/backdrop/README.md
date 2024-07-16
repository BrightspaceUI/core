# Backdrops

The `d2l-backdrop` element is a web component to display a semi-transparent backdrop behind a specified sibling element. It also hides elements other than the target from assistive technologies by applying `role="presentation"` and `aria-hidden="true"`.

## Backdrop [d2l-backdrop]

<!-- docs: demo code properties name:d2l-backdrop sandboxTitle:'Backdrop' size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/backdrop/backdrop.js';
  import '@brightspace-ui/core/components/switch/switch.js';

  const backdrop = document.querySelector('d2l-backdrop');
  document.querySelector('#target > d2l-button').addEventListener('click', () => {
    backdrop.shown = !backdrop.shown;
  });
</script>
<style>
  #target { position: relative; z-index: 1000; margin: 40px; }
</style>
<div>
  <div id="target"><d2l-button primary>Toggle backdrop</d2l-button></div>
  <d2l-backdrop for-target="target"></d2l-backdrop>
</div>
<span>Background content</span>
```

<!-- docs: start hidden content -->
### Properties:

| Property | Type | Description |
|--|--|--|
| `for-target` | String, required | id of the target element to display backdrop behind |
| `no-animate-hide` | Boolean | Disables the fade-out transition while the backdrop is being hidden |
| `shown` | Boolean | Used to control whether the backdrop is shown |
| `slow-transition` | Boolean | Increases the fade transition time to 1200ms (default is 200ms) |
<!-- docs: end hidden content -->
