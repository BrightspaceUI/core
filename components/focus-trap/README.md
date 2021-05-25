# Focus Trap

The `d2l-focus-trap` is a generic container that will trap the focus.  It will cycle the focus to the first or last focusable elements when tabbing forwards or backwards respectively.  It will also capture focus from the document when actively trapping.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/focus-trap/focus-trap.js';
</script>

<d2l-focus-trap trap>
  <button>Button 1</button>
  <button>Button 2</button>
</d2l-focus-trap>
```
