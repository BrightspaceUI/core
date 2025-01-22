# Backdrops

Use a backdrop to deemphasize background elements and draw the user's attention to a dialog or other modal content.

## Backdrop [d2l-backdrop]

<!-- docs: demo code properties name:d2l-backdrop sandboxTitle:'Backdrop' size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/backdrop/backdrop.js';

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

### Focus Management

Elements with `aria-hidden` applied (as well as their descendants) are completely hidden from assistive technologies. It's therefore very important that the element with active focus be within the backdrop target.

**When showing a backdrop**: first move focus inside the target, then set the `shown` attribute on the backdrop.

**When hiding a backdrop**: first remove the `shown` attribute on the backdrop, then if appropriate move focus outside the target.

## Accessibility

The backdrop hides background elements from screen reader users by setting `aria-hidden="true"` on all elements other than the target element specified in `for-target`.

Before showing the backdrop, focus should be moved inside the target element — see [Focus Management](#focus-management) for more details.