# Collapsible Panel

The collapsible panel is a container that can show or hide additional content. It utilizes progressive disclosure by providing the option to hide content/controls until the user needs them.

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

<style>
	.panel-container {
		display: flex;
		justify-content: center;
		padding: 1rem;
		width: 100%;
	}
	d2l-collapsible-panel {
		width: 500px;
	}
	.subtle {
		background: var(--d2l-color-gypsum);
	}
	.inline d2l-collapsible-panel {
		width: 100%;
	}
</style>

<div class="panel-container">
	<d2l-collapsible-panel panel-title="Default Collapsible Panel">
		<d2l-collapsible-panel-summary-item slot="summary" text="Use in most situations"></d2l-collapsible-panel-summary-item>
		<p>Use the default collapsible panel in most situations. The default panel type has a border.</p>
		<p>For all the panel types, you can turn the summary off if you don't need it, add additional action buttons beside the expand/collapse arrow, and add HTML content under the header. See the other collapsible panel types below for examples of those options!</p>
	</d2l-collapsible-panel>
</div>
<div class="panel-container subtle">
	<d2l-collapsible-panel type="subtle" panel-title="Subtle Collapsible Panel">
		<d2l-collapsible-panel-summary-item slot="summary" text="Use on backgrounds that are not white"></d2l-collapsible-panel-summary-item>
		<div slot="header" style="align-items: center; display: flex; gap: 0.6rem;">
			<d2l-status-indicator text="Reading Today"></d2l-status-indicator>
			<p class="d2l-body-small">Nickname: caketray</p>
		</div>
		<p>Use the subtle collapsible panel on backgrounds that are not white. The subtle collapsible panel has a shadow instead of a border, making it stand out more on darker backgrounds.</p>
		<p>This panel also has some HTML content in the header (including some information about our collapsible panel’s nickname, caketray).</p>
	</d2l-collapsible-panel>
</div>
<div class="panel-container inline">
	<d2l-collapsible-panel type="inline" panel-title="Inline Collapsible Panel">
		<d2l-dropdown-more slot="actions">
			<d2l-dropdown-menu>
				<d2l-menu>
					<d2l-menu-item text="Duplicate"></d2l-menu-item>
					<d2l-menu-item text="Delete"></d2l-menu-item>
				</d2l-menu>
			</d2l-dropdown-menu>
		</d2l-dropdown-more>
		<d2l-collapsible-panel-summary-item slot="summary" text="Use to progressively disclose sections of a complex page, or simplify a complex page by hiding entire sections"></d2l-collapsible-panel-summary-item>
		<p>Use an inline collapsible panel to progressively disclose sections of a complex page, or to allow users to simplify a complex page by hiding entire sections. The inline collapsible panel has only a top and bottom border, and the line between the header and summary is removed.</p>
		<p>This panel also has an additional action (the menu). You can add more actions in that slot if you need them.</p>
	</d2l-collapsible-panel>
</div>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to progressively disclose information or settings to simplify a complex workflow
* Keep the header consistent across the collapsed and expanded states of the panel
* Use the subtle collapsible panel for backgrounds that aren't white
* Use [`d2l-collapsible-panel-group`](#d2l-collapsible-panel-group) to group multiple panels for better visual consistency
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't nest collapsible panels
* Don't put required fields in a collapsible panel
* Avoid long lists of collapsible panels. Consider using the nested [list](https://daylight.d2l.dev/components/list/) in this case (exceptions may apply)
<!-- docs: end donts -->
<!-- docs: end best practices -->


## Collapsible Panel [d2l-collapsible-panel]

The `d2l-collapsible-panel` element is a container that provides specific layout slots such as `before`, `header`, `summary`, `actions`, and a default slot for the expanded content.

<!-- docs: demo code properties name:d2l-collapsible-panel -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
</script>

<style>
	d2l-collapsible-panel {
		width: 800px;
	}
	/* TODO: remove this when daylight demo resizing is fixed */
	d2l-collapsible-panel:not([expanded]) {
		margin-bottom: 14rem;
	}
</style>

<d2l-collapsible-panel panel-title="Collapsible Panel">
	The collapsible panel is also nicknamed caketray! Team Polaris coined this nickname back in 2020 while creating a labs component for a tool called Learning Paths (which is now replaced with the collapsible panel). They wanted to distinguish this labs component from d2l-card, but they didn't know what to call it, so they named it caketray to serve as a reminder to change the name later. Caketray caught on around the company, so much so that we had to make it an official nickname so some teams could find it! You'll see some other cake-related examples throughout this documentation to pay tribute to the collapsible panel's heritage.
</d2l-collapsible-panel>
```

<!-- docs: start hidden content -->
### Slots

| Slot | Type | Description |
|--|--|--|
| `before` | optional | Slot for content to be placed at the left side of the header, aligned with the title and header slot |
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
| `padding-type` | String | Optionally set horizontal padding of inline panels |
| `panel-title` | String | The title of the panel |
| `skeleton` | Boolean | Renders the panel title and the expand/collapse icon as skeleton loaders |
| `type` | String | The type of collapsible panel |
<!-- docs: end hidden content -->

### Panel Types

#### Default
Use the default collapsible panel in most situations.

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
</script>

<style>
	d2l-collapsible-panel {
		width: 500px;
	}
</style>

<d2l-collapsible-panel panel-title="Default">
	Expanded content
</d2l-collapsible-panel>
```

#### Subtle
Use the subtle collapsible panel on backgrounds that are not white.

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
</script>

<style>
	html {
		background: var(--d2l-color-gypsum);
	}
	d2l-collapsible-panel {
		width: 500px;
	}
</style>

<d2l-collapsible-panel panel-title="Subtle" type="subtle">
	Expanded content
</d2l-collapsible-panel>
```

#### Inline
Use an inline collapsible panel to progressively disclose sections of a complex page, or to allow users to simplify a complex page by hiding entire sections. The inline collapsible panel has only a top and bottom border, and the line between the header and summary is removed.

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
</script>

<style>
	d2l-collapsible-panel {
		width: 100%;
	}
</style>

<d2l-collapsible-panel panel-title="Inline" type="inline">
	Expanded content
</d2l-collapsible-panel>
```

## Summary Items [d2l-collapsible-panel-summary-item]
An optional summary can help the user understand what’s inside the collapsible panel without having to expand it. This can be helpful if the user needs more than the heading to explain what’s inside.

<!-- docs: demo properties name:d2l-collapsible-panel-summary-item -->
```html
<script type="module">
import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel-summary-item.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/form/form.js';
import { css, html, LitElement } from 'lit';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class CollapsiblePanelDaylightDemo extends LitElement {

	static get properties() {
		return {
      _addons: { state: true },
			_icingType: { state: true },
			_icingTypes: { state: true },
		};
	}

	static get styles() {
		return [labelStyles, selectStyles, css`
			d2l-collapsible-panel {
				width: 500px;
			}
			/* TODO: remove this when daylight demo resizing is fixed */
			d2l-collapsible-panel:not([expanded]) {
				margin-bottom: 12rem;
			}
		`];
	}

	constructor() {
		super();
		this._addons = [
			{ id: 'name', text: 'Personalized name', checked: false },
			{ id: 'candles', text: 'Candles', checked: false },
			{ id: 'cutlery', text: 'Plates and forks', checked: false },
		];
		this._icingTypes = ['Buttercream frosting', 'Cream cheese frosting', 'Royal icing', 'Swiss meringue buttercream'];
		this._icingType = this._icingTypes[0];
	}

	render() {
		return html`
			<d2l-collapsible-panel panel-title="Cake Decoration">
				${this._renderSummaryItems()}

				<p class="d2l-label-text">Icing type</p>
				<select class="d2l-input-select" @change="${this._onChangeSelect}">
					${this._icingTypes.map((option) => html`<option>${option}</option>`)}
				</select>

				<p class="d2l-label-text">Add-ons</p>
				${this._addons.map((item) => (
					html`<d2l-input-checkbox id="${item.id}" @change="${this._onChangeCheckbox}">${item.text}</d2l-input-checkbox>`
				))}
			</d2l-collapsible-panel>
		`;
	}

	_onChangeCheckbox(e) {
		const index = this._addons.findIndex((obj => obj.id === e.target.getAttribute('id')));
		this._addons[index].checked = e.target.checked;
		this.requestUpdate();
	}

	_onChangeSelect(e) {
		this._icingType = e.target.value;
	}

	_renderSummaryItems() {
		return html`
			<d2l-collapsible-panel-summary-item slot="summary" text="${this._icingType}"></d2l-collapsible-panel-summary-item>
			${this._addons.filter(item => item.checked).map((item) => (
				html`<d2l-collapsible-panel-summary-item slot="summary" text="${item.text}"></d2l-collapsible-panel-summary-item>`
			))}
		`;
	}
}
customElements.define('d2l-collapsible-panel-daylight-demo', CollapsiblePanelDaylightDemo);
</script>
<d2l-collapsible-panel-daylight-demo></d2l-collapsible-panel-daylight-demo>
```

More than one `d2l-collapsible-panel-summary-item` can be added to the `summary` slot, and each will appear on its own line.

```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel-summary-item.js';
</script>

<d2l-collapsible-panel panel-title="Cake Decoration">
	<d2l-collapsible-panel-summary-item slot="summary" text="Buttercream icing"></d2l-collapsible-panel-summary-item>
	<d2l-collapsible-panel-summary-item slot="summary" text="Personalized name"></d2l-collapsible-panel-summary-item>
	<d2l-collapsible-panel-summary-item slot="summary" text="Candles"></d2l-collapsible-panel-summary-item>
	<d2l-collapsible-panel-summary-item slot="summary" text="Plates and Forks"></d2l-collapsible-panel-summary-item>
	Expanded content
</d2l-collapsible-panel>
```

## Header and Actions Slots

Collapsible panels have two optional slots, `header` and `actions` that can be used to add more information to the header area.


<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/core/components/button/button-icon.js';
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel-summary-item.js';
	import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
	import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
	import '@brightspace-ui/core/components/link/link.js';
	import '@brightspace-ui/core/components/menu/menu.js';
	import '@brightspace-ui/core/components/menu/menu-item.js';
	import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<style>
	d2l-collapsible-panel {
		width: 800px;
	}
</style>

<d2l-collapsible-panel panel-title="Submission 1">
	<d2l-button-icon slot="actions" icon="tier1:fullscreen"></d2l-button-icon>
	<d2l-button-icon slot="actions" icon="tier1:download"></d2l-button-icon>
	<d2l-dropdown-more slot="actions">
		<d2l-dropdown-menu>
			<d2l-menu>
				<d2l-menu-item text="Duplicate"></d2l-menu-item>
				<d2l-menu-item text="Delete"></d2l-menu-item>
			</d2l-menu>
		</d2l-dropdown-menu>
	</d2l-dropdown-more>
	<div slot="header" style="align-items: center; display: flex; gap: 0.6rem;">
		<d2l-status-indicator state="none" text="Pending Evaluation"></d2l-status-indicator>
		<p class="d2l-body-small">Submitted On: Jul 20, 2021 - 2:23 PM</p>
		<d2l-link small href="https://www.d2l.com" target="blank">Link to post</d2l-link>
	</div>
	<d2l-collapsible-panel-summary-item slot="summary" text="Week 2 Lab (PDF) attached"></d2l-collapsible-panel-summary-item>
	<d2l-collapsible-panel-summary-item slot="summary" text="1 comment"></d2l-collapsible-panel-summary-item>
	<p style="margin-top: 0;">Sweet roll candy dessert caramels shortbread gummies toffee oat cake cookie. Wafer gummies shortbread sweet halvah jujubes sweet. Cake chocolate chocolate bar carrot cake marzipan. Icing chupa chups jujubes macaroon toffee chocolate bar wafer croissant.</p>
	<p>Toffee pastry chupa chups lollipop carrot cake chocolate cake sweet roll sweet roll. Marzipan pudding candy canes jelly lemon drops oat cake ice cream. Wafer danish pudding marzipan chupa chups jelly beans brownie.</p>
	<p>Pastry apple pie biscuit sesame snaps sweet pie apple pie dessert jelly beans. Lemon drops croissant tootsie roll croissant oat cake. Macaroon toffee pie gummi bears cupcake wafer tiramisu.</p>
	<p style="margin-bottom: 0;">Chocolate cake ice cream cake chocolate bar dessert. Donut tiramisu fruitcake tiramisu liquorice shortbread sugar plum macaroon caramels. Tart candy cookie ice cream dessert tootsie roll.</p>
</d2l-collapsible-panel>
```

## Group of Panels [d2l-collapsible-panel-group]

Use the `d2l-collapsible-panel-group` component to automatically handle spacing and layout for multiple panels.

<!-- docs: demo code properties name:d2l-collapsible-panel-group -->
```html
<script type="module">
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel.js';
	import '@brightspace-ui/core/components/collapsible-panel/collapsible-panel-group.js';
</script>

<style>
	d2l-collapsible-panel-group {
		width: 800px;
	}
</style>

<d2l-collapsible-panel-group>
	<d2l-collapsible-panel panel-title="Submission 1">
		<p>Sweet roll candy dessert caramels shortbread gummies toffee oat cake cookie. Wafer gummies shortbread sweet halvah jujubes sweet. Cake chocolate chocolate bar carrot cake marzipan. Icing chupa chups jujubes macaroon toffee chocolate bar wafer croissant.</p>
	</d2l-collapsible-panel>
	<d2l-collapsible-panel panel-title="Submission 2">
		<p>Sweet roll candy dessert caramels shortbread gummies toffee oat cake cookie. Wafer gummies shortbread sweet halvah jujubes sweet. Cake chocolate chocolate bar carrot cake marzipan. Icing chupa chups jujubes macaroon toffee chocolate bar wafer croissant.</p>
	</d2l-collapsible-panel>
	<d2l-collapsible-panel panel-title="Submission 3">
		<p>Sweet roll candy dessert caramels shortbread gummies toffee oat cake cookie. Wafer gummies shortbread sweet halvah jujubes sweet. Cake chocolate chocolate bar carrot cake marzipan. Icing chupa chups jujubes macaroon toffee chocolate bar wafer croissant.</p>
	</d2l-collapsible-panel>
</d2l-collapsible-panel-group>
```

## Accessibility

### Panel label
By default, the panel is described by screen readers with the `panel-title` attribute. There may be situations where the screen reader should read additional information. In this case, a special label can be specified using the `expand-collapse-label` property.

### Keyboard behaviour

On focus, a focus ring (blue border) goes around the clickable area of the component. When collapsed, this area is the entire panel; when expanded, it's only the header.

Any focusable actions placed in the `actions` slot will receive focus after the panel recevies focus. The open/close icon beside the `actions` slot looks like a button, but is an indicator of component state. It will not receive focus like a typical button.
