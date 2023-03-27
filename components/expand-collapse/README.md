# Expand Collapse Content

The `d2l-expand-collapse-content` element can be used to create expandable and collapsible content. This component only provides the logic to expand and collapse the content; controlling when and how it expands or collapses is the responsibility of the user.

## Expand Collapse Content [d2l-expand-collapse-content]

<!-- docs: demo live name:d2l-expand-collapse-content autoSize:false display:block size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';

  const button = document.querySelector('d2l-button');
  button.addEventListener('click', () => {
    const section = document.querySelector('d2l-expand-collapse-content');
    section.expanded = !section.expanded;
    button.setAttribute('aria-expanded', section.expanded ? 'true' : 'false');
  });
</script>
<d2l-button primary>Toggle</d2l-button>
<d2l-expand-collapse-content>
  <p>My expand collapse content.</p>
</d2l-expand-collapse-content>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `expanded` | Boolean, default: `false` | Specifies the expanded/collapsed state of the content |

### Events

- `d2l-expand-collapse-content-expand`: dispatched when the content starts to expand. The `detail` contains an `expandComplete` promise that can be waited on to determine when the content has finished expanding.
- `d2l-expand-collapse-content-collapse`: dispatched when the content starts to collapse. The `detail` contains a `collapseComplete` promise that can be waited on to determine when the content has finished collapsing.
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-expand-collapse-content` accessible, the [`aria-expanded` attribute](https://www.w3.org/TR/wai-aria/#aria-expanded) should be added to the element that controls expanding and collapsing the content with `"true"` or `"false"` to indicate that the content is expanded or collapsed.

