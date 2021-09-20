# Collapsible Containers

## Expand Collapse Content [d2l-expand-collapse-content]

The `d2l-expand-collapse-content` element can be used to create expandable and collapsible content. This component only provides the logic to expand and collapse the content; controlling when and how it expands or collapses is the responsibility of the user.

<!-- docs: start hidden content -->
![Expand Collapse Content](./screenshots/expand-collapse-content.gif?raw=true)
<!-- docs: end hidden content -->

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

## More-Less [d2l-more-less]

The `d2l-more-less` element can be used to minimize the display of long content, while providing a way to reveal the full content.

<!-- docs: start hidden content -->
![More-Less](./screenshots/more-less.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-more-less -->
```html
<script type="module">
  import '@brightspace-ui/core/components/more-less/more-less.js';
</script>
<d2l-more-less>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</d2l-more-less>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `blur-color` | String | Gradient HEX formatted color of the blurring effect (defaults to white). |
| `expanded` | Boolean | Specifies the expanded/collapsed state of the content |
| `h-align` | String | A value of `text` aligns the leading edge of text |
| `height` | String, default: `'4em'` | Maximum height of the content when in "less" mode. The `d2l-more-less` element itself will take up additional vertical space for the fading effect as well as the more/less button itself. |
| `inactive` | Boolean | Whether the component is active or inactive |
<!-- docs: end hidden content -->
