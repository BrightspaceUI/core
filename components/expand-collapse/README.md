# Expand Collapse

The `d2l-expand-collapse` element can be used to used to create expandable and collapsible content. This component only provides the logic to expand and collapse the content; controlling when and how it expands or collapses is the responsibility of the user.

![Expand Collapse](./screenshots/expand-collapse.gif?raw=true)

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

To make your usage of `d2l-expand-collapse` accessible, the [`aria-expanded` attribute](https://www.w3.org/TR/wai-aria/#aria-expanded) should be added to the element that controls expanding and collapsing the content with `"true"` or `"false"` to indicate that the content is expanded or collapsed.

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
