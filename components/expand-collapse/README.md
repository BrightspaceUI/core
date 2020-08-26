# Expand Collapse

## Expand Collapse Content

The `d2l-expand-collapse-content` element can be used to used to create expandable and collapsible content. This component only provides the logic to expand and collapse the content; controlling when and how it expands or collapses is the responsibility of the user.

![Expand Collapse Content](./screenshots/expand-collapse-content.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';
</script>

<d2l-expand-collapse-content expanded>
  <p>My expand collapse content.</p>
</d2l-expand-collapse-content>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `expanded` | Boolean, default: `false` | Specifies the expanded/collapsed state of the content |

**Events:**

- `d2l-expand-collapse-content-expand`: dispatched when the content starts to expand. The `detail` contains an `expandComplete` promise that can be waited on to determine when the content has finished expanding.
- `d2l-expand-collapse-content-collapse`: dispatched when the content starts to collapse. The `detail` contains a `collapseComplete` promise that can be waited on to determine when the content has finished collapsing.

**Accessibility:**

To make your usage of `d2l-expand-collapse-content` accessible, the [`aria-expanded` attribute](https://www.w3.org/TR/wai-aria/#aria-expanded) should be added to the element that controls expanding and collapsing the content with `"true"` or `"false"` to indicate that the content is expanded or collapsed.

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
