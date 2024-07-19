
# User Focus
This component assists with managing user focus within your web application.

## Focus Trap [d2l-focus-trap]

The `d2l-focus-trap` is a generic container that will trap user focus from leaving. Focus will cycle to the first or last focusable elements when tabbing forwards or backwards respectively.  It will also capture focus from the document when actively trapping.

<!-- docs: demo code properties name:d2l-focus-trap sandboxTitle:'Focus Trap' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/focus-trap/focus-trap.js';
</script>
<d2l-focus-trap trap>
  <!--content in which focus should be trapped -->
  <d2l-button>It's a trap!</d2l-button>
  <d2l-button>You shall not pass!</d2l-button>
</d2l-focus-trap>
```
<!-- docs: start hidden content -->

### Properties

| Property | Type | Description |
|---|---|---|
| `trap` | Boolean | Whether to trap the focus |

### Events

- `d2l-focus-trap-enter`: dispatched when focus enters the trap. May be used to override initial focus placement when focus enters the trap.
<!-- docs: end hidden content -->
