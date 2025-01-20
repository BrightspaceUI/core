# Expand Collapse Content

The `d2l-expand-collapse-content` element can be used to create expandable and collapsible content. This component only provides the logic to expand and collapse the content; controlling when and how it expands or collapses is the responsibility of the user.

## Expand Collapse Content [d2l-expand-collapse-content]

<!-- docs: demo code properties name:d2l-expand-collapse-content sandboxTitle:'Expand Collapse Content' autoSize:false display:block size:small -->
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

## Accessibility

To make your usage of `d2l-expand-collapse-content` accessible, it should follow the [W3C Disclosure (Show/Hide) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).

To achieve this, the control that toggles the expanded state should:
 - Should use the [`d2l-button`](../button) or use an element with the [`button`](https://w3c.github.io/aria/#button) role
 - Toggle between states when using the `Enter` and `Space` buttons and retain focus upon toggle
 - Have the [`aria-expanded`](https://www.w3.org/TR/wai-aria/#aria-expanded) attribute, so screen reader users will know what state it's in
 - Be adjacent to the expanded/collapsed content

