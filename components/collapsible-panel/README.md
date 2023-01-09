# Collapsible Panel

A collapsible panel is a container that can be expanded and collapsed to show/hide additional content and form options. Content within the panel is flexible and customizable -- form controls, buttons, text, and more can be put in the expanded version of this panel for users to interact with or view.

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
</script>

<d2l-collapsible-panel panel-title="Availability Dates and Conditions">
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.
</d2l-collapsible-panel>

<d2l-collapsible-panel type="subtle" panel-title="Availability Dates and Conditions">
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.
</d2l-collapsible-panel>

<d2l-collapsible-panel type="inline" panel-title="Availability Dates and Conditions">
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.
</d2l-collapsible-panel>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use for optional settings or additional information that you want to initially hide
* Use when the user would benefit from progressively disclosed information
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't nest collapsible panels within each other
* Don't change the header contents when the panel is expanded/collapsed
* Don't have interactions or elements in the closed state that are different or disappear in the open state (exception: the summary)
	* For example, don't have a button that's only available in the collapsed state of the panel
* Avoid using a collapsible panel for required options in a form
* Avoid long lists of collapsible panels; consider using a nested [list](https://daylight.d2l.dev/components/list/) in this case (exceptions may apply)
<!-- docs: end donts -->
<!-- docs: end best practices -->


## Collapsible Panel [d2l-collapsible-panel]

The `d2l-collapsible-panel` element is a container that provides specific layout slots such as `header`, `summary`, `actions`, and a default slot for the expanded content.

<!-- docs: demo live name:d2l-collapsible-panel -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
</script>

<d2l-collapsible-panel panel-title="Availability Dates and Conditions">
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.
</d2l-collapsible-panel>
```

<!-- docs: start hidden content -->
### Slots

| Slot | Type | Description |
|--|--|--|
| `header` | optional | Supporting header content |
| `actions` | optional | Buttons and dropdown openers to be placed in top right corner of header |
| `summary` | optional | Summary of the expanded content. Only accepts `d2l-collapsible-panel-summary-item` |
| `default` | required | Content that is rendered when the panel is expanded |


### Properties

| Property | Type | Description |
|--|--|--|
| `expanded` | Boolean | Whether or not the panel is expanded |
| `expand-collapse-label` | String | Optional label describing the contents of the header (used by screen readers) |
| `heading-style` | Number | The heading style to use |
| `heading-level` | Number | Semantic heading level (h1-h4) |
| `no-sticky` | Boolean | Disables sticky positioning for the header |
| `padding` | String | Optionally set horizontal padding of inline panels |
| `panel-title` | String | The title of the panel |
| `type` | String | The type of collapsible panel |
<!-- docs: end hidden content -->

### Panel Types

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
</script>

<d2l-collapsible-panel panel-title="Default panel">
	This is the default collapsible panel style
</d2l-collapsible-panel>

<d2l-collapsible-panel type="subtle" panel-title="Subtle panel">
	This is the "subtle" collapsible panel style
</d2l-collapsible-panel>

<d2l-collapsible-panel type="inline" panel-title="Inline panel">
	This is the "inline" collapsible panel style
</d2l-collapsible-panel>
```

## Summary Items [d2l-collapsible-panel-summary-item]
The summary area takes information from the expanded panel and summarizes it for the collapsed version. This can help the user understand what information is inside the panel without having to click on it.

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel-summary-item.js';
</script>

<d2l-collapsible-panel panel-title="Availability Dates and Conditions">
	<div slot="summary">
		<d2l-collapsible-panel-summary-item text="Availability starts 8/16/2022 and ends 8/12/2022"></d2l-collapsible-panel-summary-item>
		<d2l-collapsible-panel-summary-item text="1 release condition"></d2l-collapsible-panel-summary-item>
		<d2l-collapsible-panel-summary-item text="Hidden by special access"></d2l-collapsible-panel-summary-item>
	</div>
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.
</d2l-collapsible-panel>
```

## Optional slots

Collapsible panels have two optional slots, `actions` and `header` that can be used to add more information to the header area.


<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/button/button-icon.js';
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel-summary-item.js';
	import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
	import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
	import '@brightspace-ui/core/components/menu/menu.js';
	import '@brightspace-ui/core/components/menu/menu-item.js';
	import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-collapsible-panel panel-title="Session: January 1, 2021: 10:00 AM" expand-collapse-label="Session on January 1">
	<d2l-button-icon slot="actions" icon="tier1:fullscreen"></d2l-button-icon>
	<d2l-button-icon slot="actions" icon="tier1:download"></d2l-button-icon><d2l-dropdown-more>
		<d2l-dropdown-menu>
			<d2l-menu>
				<d2l-menu-item text="Duplicate"></d2l-menu-item>
				<d2l-menu-item text="Delete"></d2l-menu-item>
			</d2l-menu>
		</d2l-dropdown-menu>
	</d2l-dropdown-more>
	<div slot="header" style="align-items: center; display: flex; gap: 0.6rem;">
		<d2l-status-indicator state="none" text="Due Today"></d2l-status-indicator>
		<p class="d2l-body-small">Posts: 1 thread, 1 reply</p>
		<d2l-link small href="https://www.d2l.com" target="blank">Link</d2l-link>
	</div>
	<div slot="summary">
		<d2l-collapsible-panel-summary-item text="Always available"></d2l-collapsible-panel-summary-item>
	</div>
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor. Praesent lobortis libero in libero sagittis consectetur. Maecenas ut velit efficitur, consectetur augue vitae, finibus turpis. In id tempor quam. Integer sed facilisis mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut a volutpat lacus. Suspendisse potenti. Quisque egestas erat urna, et accumsan est accumsan sit amet. Sed luctus vestibulum lacus. Mauris nisi orci, rhoncus sed est sit amet, pretium facilisis felis.
</d2l-collapsible-panel>
```

## Accessibility

### Panel label
By default, the panel is described by screen readers with the `panel-title` attribute. There may be situations where the screen reader should read additional information. In this case, a special label can be specified using the `expand-collapse-label` property.

### Keyboard behaviour

On focus, a focus ring (blue border) goes around the clickable area of the component. When collapsed, this area is the entire panel; when expanded, it's only the header.

Any focusable actions placed in the `actions` slot will receive focus after the panel recevies focus. The open/close icon beside the `actions` slot looks like a button, but is an indicator of component state. It will not receive focus like a typical button.
