# Focus Trap

## d2l-focus-trap

The `d2l-focus-trap` is a generic container that will trap the focus.  It will cycle the focus to the first or last focusable elements when tabbing forwards or backwards respectively.  It will also capture focus from the document when actively trapping.

```html
<script type="module">
  import '@brightspace-ui/core/components/focus-trap/focus-trap.js';
</script>

<d2l-focus-trap trap>
  <!--content in which focus should be trapped -->
</d2l-focus-trap>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `trap` | Boolean | Whether to trap the focus |

**Events:**

- `d2l-focus-trap-enter`: dispatched when focus enters the trap. May be used to override initial focus placement when focus enters the trap.

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
