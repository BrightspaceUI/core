# Expand Collapse

The `d2l-expand-collapse` element can be used to used to create expandable and collapsible sections. This component only provides the logic to expand and collapse the section. Controlling when and how the section expands or collapses is the responsibility of the user.

![More-Less](./screenshots/expand-collapse.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/expand-collapse/expand-collapse.js';
</script>

<button>Toggle</button>
<d2l-expand-collapse>
  <p>My expand collapse content.</p>
</d2l-expand-collapse>

<script type="module">
  const button = document.querySelector('button');
  button.addEventListener('click', () => {
    const section = document.querySelector('d2l-expand-collapse');
    section.expanded = !section.expanded;
    button.setAttribute('aria-expanded', section.expanded ? 'true' : 'false');
  });
</script>
```

**Properties:**

- `expanded` (Boolean, default: `false`): Specifies the expanded/collapsed state of the content

**Accessibility:**

To make your usage of `d2l-expand-collapse` accessible, the `aria-expanded` attribute should be added to the element that controls expanding and collapsing section with `"true"` or `"false"` to indicate that the section is expanded or collapsed.

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
