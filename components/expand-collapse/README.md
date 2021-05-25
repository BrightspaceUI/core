# Expand Collapse Content

The `d2l-expand-collapse-content` element can be used to used to create expandable and collapsible content. This component only provides the logic to expand and collapse the content; controlling when and how it expands or collapses is the responsibility of the user.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';
</script>
<script type="module">
  const button = document.querySelector('button');
  button.addEventListener('click', () => {
    const section = document.querySelector('d2l-expand-collapse-content');
    section.expanded = !section.expanded;
    button.setAttribute('aria-expanded', section.expanded ? 'true' : 'false');
  });
</script>

<button>Toggle</button>
<d2l-expand-collapse-content>
  <p>My expand collapse content.</p>
</d2l-expand-collapse-content>
```

## Accessibility

To make your usage of `d2l-expand-collapse-content` accessible, the [`aria-expanded` attribute](https://www.w3.org/TR/wai-aria/#aria-expanded) should be added to the element that controls expanding and collapsing the content with `"true"` or `"false"` to indicate that the content is expanded or collapsed.
