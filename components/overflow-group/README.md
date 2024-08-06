# Overflow Groups
An Overflow Group adds responsive behaviour to a group of buttons, links, or menus.

<!-- docs: demo autoSize:false display:block size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/overflow-group/overflow-group.js';
</script>
<d2l-overflow-group>
	<d2l-button>New</d2l-button>
	<d2l-dropdown>
		<d2l-dropdown-button text="Explore Topics" class="d2l-dropdown-opener"></button>
		<d2l-dropdown-menu id="dropdown" >
			<d2l-menu label="Astronomy">
				<d2l-menu-item text="Introduction"></d2l-menu-item>
				<d2l-menu-item text="Searching for the Heavens"></d2l-menu-item>
				<d2l-menu-item text="The Solar System"></d2l-menu-item>
				<d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
				<d2l-menu-item text="The Night Sky"></d2l-menu-item>
				<d2l-menu-item text="The Universe"></d2l-menu-item>
			</d2l-menu>
		</d2l-dropdown-menu>
	</d2l-dropdown>
	<d2l-button>Copy</d2l-button>
	<d2l-button>Import</d2l-button>
	<d2l-button>Delete</d2l-button>
</d2l-overflow-group>
```
## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use when grouping 3 or more adjacent actions
* Consider whether visible actions can be reduced
* Use `max-to-show` to set an upper limit on how many actions are displayed before overflowing; this can prevent users from feeling overwhelmed with top-level choices
* Use the `subtle` `opener-style` if the actions are [Subtle Buttons](../../components/button#d2l-button-subtle)
<!-- docs: end dos -->

<!-- docs: start donts -->
* Avoid using `min-to-show` unless users are heavily impacted when the first 1 or 2 actions overflow into the More Actions menu
* Don't use the `icon` `opener-type` unless it's for page-level actions in the top right corner of the page, or if space is severely limited
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Overflow Group [d2l-overflow-group]

Items added to this container element will no longer wrap onto a second line when the container becomes too small, but will be added to a dropdown menu with configurable styling.

<!-- docs: demo code properties name:d2l-overflow-group sandboxTitle:'Overflow Group' autoSize:false display:block size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/overflow-group/overflow-group.js';
</script>
<d2l-overflow-group max-to-show="3">
	<d2l-button>New</d2l-button>
	<d2l-dropdown>
		<d2l-dropdown-button text="Explore Topics" class="d2l-dropdown-opener"></button>
		<d2l-dropdown-menu id="dropdown" >
			<d2l-menu label="Astronomy">
				<d2l-menu-item text="Introduction"></d2l-menu-item>
				<d2l-menu-item text="Searching for the Heavens"></d2l-menu-item>
				<d2l-menu-item text="The Solar System"></d2l-menu-item>
				<d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
				<d2l-menu-item text="The Night Sky"></d2l-menu-item>
				<d2l-menu-item text="The Universe"></d2l-menu-item>
			</d2l-menu>
		</d2l-dropdown-menu>
	</d2l-dropdown>
	<d2l-button>Copy</d2l-button>
	<d2l-button>Import</d2l-button>
	<d2l-button>Delete</d2l-button>
	<d2l-link href="http://www.desire2learn.com">D2L</d2l-link>
</d2l-overflow-group>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `auto-show` | Boolean | Automatically determine the min and maximum number of items to show based on which elements have classes `d2l-button-group-show` and `d2l-button-group-no-show`. Please consult the design team when using this attribute. |
| `min-to-show` | Number | The minimum number of elements to always show. Please consult the design team when using this attribute. |
| `max-to-show` | Number | The maximum number of elements to show |
| `opener-style` | String | Set the style of the overflow menu `default` renders a `d2l-button` while `subtle` will render a `d2l-button-subtle`|
| `opener-type` | String | Set the opener type to `default` or `icon`, which will permanently render the dropdown menu symbol as `...` |

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->

## OverflowGroupMixin
This mixin allows for creation of an overflow group that handles chomping when using elements that are not buttons, links, or menus, or when wanting an overflow container that is not a `d2l-dropdown`.

### How to Use

**Import:**
```javascript
import { OverflowGroupMixin } from '@brightspace-ui/core/components/overflow-group/overflow-group-mixin.js';

class OtherOverflowGroup extends OverflowGroupMixin(LitElement) {
...
```

**Styles:**

```javascript
static get styles() {
  return [ super.styles ];
}
```

**Functionality:**

The functions `getOverflowContainer` and `convertToOverflowItem` need to be implemented by consumers of the mixin.

```javascript
convertToOverflowItem(node) {
  // return html of overflow item. For example:
  return html`<d2l-menu-item text="${node.text}"></d2l-menu-item>`;
}

getOverflowContainer(overflowItems, mini) {
  // return html of overflow menu. "mini" specifies if smaller menu option should be used, where applicable. For example:
  if (mini) html`<d2l-dropdown-context-menu text="Overflow Menu"><d2l-dropdown-menu>${overflowItems}</d2l-dropdown-menu></d2l-dropdown-context-menu>`;
  else return html`<d2l-dropdown-button text="Overflow Menu"><d2l-dropdown-menu>${overflowItems}</d2l-dropdown-menu></d2l-dropdown-button>`;
}
```

## Accessibility

Navigation and focus order are impacted when items overflow the viewport; they are physically moved into the More Actions menu. Since this effect is not limited to visual presentation, it affects both screen reader users and sighted users equally.

The accessibility and keyboard interaction of the More Actions menu aligns with [W3C's best practices for menus](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) — see [Menu](../../components/menu) for more information.
