# Selection

The selection components (`d2l-selection-action`, `d2l-selection-input`, `d2l-selection-select-all`, `d2l-selection-summary`, `d2l-selection-action`) are low-level components that provide the ability to create selection interfaces with select-all and bulk-action behaviours.

<!-- docs: start hidden content -->
![Selection](./screenshots/selection-multiple.png?raw=true)

![Selection](./screenshots/selection-single.png?raw=true)
<!-- docs: end hidden content -->

## SelectionMixin

The selection components below work with a component that extends the `SelectionMixin`, which acts like a controller for the checkboxes, radios, actions, etc. The `d2l-selection-input` component must be placed _within_ the component that extends the `SelectionMixin`.  The other selection components may also be placed inside the `SelectionMixin` component, or in the same DOM scope with the `selection-for` attribute set to the id of that component.

<!-- docs: demo live name:d2l-demo-selection display:block -->
```html
<script type="module">
  import { css, html, LitElement } from 'lit-element/lit-element.js';
  import { SelectionMixin } from '@brightspace-ui/core/components/selection/selection-mixin.js';

  class CustomSelection extends SelectionMixin(LitElement) {
    static get styles() {
      return css`
        :host {
          display: block;
        }
      `;
    }
    render() {
      return html`
        <slot></slot>
      `;
    }
  }
  customElements.define('d2l-demo-selection', CustomSelection);
</script>
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-action.js';
  import '@brightspace-ui/core/components/selection/selection-input.js';
  import '@brightspace-ui/core/components/selection/selection-select-all.js';
  import '@brightspace-ui/core/components/selection/selection-summary.js';
</script>
<!-- docs: start hidden content -->
<script type="module">
  import '@brightspace-ui/core/components/selection/demo/demo-selection.js';
</script>
<style>
  ul {
    padding: 0;
  }
  li {
    list-style-type: none;
  }
  li, .d2l-selection-header, .d2l-selection-header-wrapper {
    align-items: center;
    display: flex;
  }
  d2l-selection-input {
    margin-right: 10px;
  }
  [dir="rtl"] d2l-selection-input {
    margin-left: 10px;
    margin-right: 0;
  }
  .d2l-selection-header-wrapper {
    flex-wrap: wrap;
  }
  .d2l-selection-header {
    flex: auto;
  }
  d2l-selection-summary {
    flex: none;
  }
</style>
<!-- docs: end hidden content -->
<d2l-demo-selection>
  <div class="d2l-selection-header-wrapper">
    <div class="d2l-selection-header">
      <d2l-selection-select-all></d2l-selection-select-all>
      <d2l-selection-action text="Bookmark" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
      <d2l-selection-action text="Settings" icon="tier1:gear"></d2l-selection-action>
    </div>
    <d2l-selection-summary></d2l-selection-summary>
  </div>
  <ul>
    <li><d2l-selection-input key="geo" label="Geography" selected></d2l-selection-input>Geography</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>Science</li>
    <li><d2l-selection-input key="mth" label="Math"></d2l-selection-input>Math</li>
  </ul>
</d2l-demo-selection>
```

The `d2l-list` already extends `SelectionMixin` and should always be used for lists, however a custom selection control can be easily defined to enable the use of these selection controls in different semantic contexts or radically different layouts. The `SelectionMixin` defines the `selection-single` attribute that consumers can specify for single selection behaviour.

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `item-count` | Number | Total number of items. Required when selecting all pages is allowed. |
| `selection-single` | Boolean | Whether to render with single selection behaviour. If `selection-single` is specified, the nested `d2l-selection-input` elements will render radios instead of checkboxes, and the selection component will maintain a single selected item. |
<!-- docs: end hidden content -->

### Usage

The selection components can then be used within the custom selection component as shown above, or the non-`d2l-selection-input` components can be used outside the custom selection component as long as they are in the same DOM scope:

```html
<div>
  <d2l-selection-select-all selection-for="custom"></d2l-selection-select-all>
  <d2l-selection-action selection-for="custom" text="Settings" icon="tier1:gear"></d2l-selection-action>
  <d2l-selection-summary selection-for="custom"></d2l-selection-summary>
</div>
<d2l-custom-selection id="custom">
  <ul>
    <li><d2l-selection-input key="geo" label="Geography" selected></d2l-selection-input>Geography</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>Science</li>
  </ul>
</d2l-custom-selection>
```

## Selection Action [d2l-selection-action]

The `d2l-selection-action` is an optional component that provides a button for actions associated with the selection component (ex. bulk actions). The `requires-selection` attribute may be specified to indicate that the button should be non-interactive if nothing is selected.

<!-- docs: demo live name:d2l-selection-action -->
```html
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-action.js';
</script>
<d2l-selection-action text="Bookmark" icon="tier1:bookmark-hollow"></d2l-selection-action>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `icon` | String | Preset icon key (e.g. "tier1:gear"). |
| `requires-selection` | Boolean | Whether the action requires one or more selected items. If no items are selected, the action button will be focusable and a hint displayed in a tooltip. |
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |
| `text` | String, required | Text to be shown for the action. |

### Events

| Event | Description |
|---|---|
| `d2l-selection-action-click` | Dispatched when the user clicks the action button. The `SelectionInfo` is provided as the event `detail`. If `requires-selection` was specified then the event will only be dispatched if items are selected. |
<!-- docs: end hidden content -->

## Selection Action Dropdown [d2l-selection-action-dropdown]

The `d2l-selection-action-dropdown` is an optional component that provides a button opener for dropdown content associated with the selection component (ex. bulk actions). The `requires-selection` attribute may be specified to indicate that the opener should be non-interactive if nothing is selected.

<!-- docs: demo live name:d2l-selection-action-dropdown -->
```html
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
  import '@brightspace-ui/core/components/selection/selection-action-dropdown.js';
</script>
<d2l-selection-action-dropdown text="Actions" requires-selection>
  <d2l-dropdown-menu>
    <d2l-menu label="Actions">
      <d2l-menu-item text="Action 1"></d2l-menu-item>
      <d2l-menu-item text="Action 2"></d2l-menu-item>
    </d2l-menu>
  </d2l-dropdown-menu>
</d2l-selection-action-dropdown>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `requires-selection` | Boolean | Whether the action dropdown opener requires one or more selected items. If no items are selected, the opener will be focusable and a hint displayed in a tooltip. |
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |
| `text` | String, required | Text for the dropdown opener button. |
<!-- docs: end hidden content -->

## Selection Action Menu Item [d2l-selection-action-menu-item]

The `d2l-selection-action-menu-item` is an optional component that is a menu item for actions associated with the selection component (ex. bulk actions). The `requires-selection` attribute may be specified to indicate that the menu item should be non-interactive if nothing is selected. This component enables the app to define an opener that is enabled regardless of the selection state, while having a menu containing one or more menu items that `requires-selection`.

<!-- docs: demo live name:d2l-selection-action-menu-item -->
```html
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/selection/selection-action-menu-item.js';
</script>
<d2l-dropdown-button-subtle text="Actions">
	<d2l-dropdown-menu>
		<d2l-menu label="Actions">
			<d2l-selection-action-menu-item text="Action 1" requires-selection></d2l-selection-action-menu-item>
			<d2l-selection-action-menu-item text="Action 2"></d2l-selection-action-menu-item>
		</d2l-menu>
	</d2l-dropdown-menu>
</d2l-dropdown-button-subtle>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `requires-selection` | Boolean | Whether the action menu-item requires one or more selected items. |
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |
| `text` | String, required | Text to be shown for the action menu-item. |

### Events

| Event | Description |
|---|---|
| `d2l-selection-action-click` | Dispatched when the user clicks the action menu-item. The `SelectionInfo` is provided as the event `detail`. If `requires-selection` was specified then the event will only be dispatched if items are selected. |
<!-- docs: end hidden content -->

## Selection Input [d2l-selection-input]

The `d2l-selection-input` is a required component in selection controls - without it, there wouldn't be anything for the user to select! Note: `d2l-list-item` already provides a selection input for selectable list items. If `d2l-selection-input` is placed within a selection control that specifies `selection-single`, then radios will be rendered instead of checkboxes.

<!-- docs: demo live name:d2l-selection-input display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-input.js';
  import '@brightspace-ui/core/components/selection/demo/demo-selection.js';
</script>
<!-- docs: start hidden content -->
<style>
  ul {
    padding: 0;
  }
  li {
    list-style-type: none;
    align-items: center;
    display: flex;
  }
  d2l-selection-input {
    margin-right: 10px;
  }
</style>
<!-- docs: end hidden content -->
<d2l-demo-selection>
  <ul>
    <li><d2l-selection-input key="geo" label="Geography" selected></d2l-selection-input>Geography</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>Science</li>
  </ul>
</d2l-demo-selection>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `key` | String, required | Key to identify the selectable. |
| `label` | String | Accessible hidden label for the input. |
| `labelled-by` | String | Id reference to the accessible label for the input. **Note:** if specified, it must reference an element in the same DOM context. |
| `selected` | Boolean | State of the input. |

### Events

| Event | Description |
|---|---|
| `d2l-selection-change` | Dispatched when the state of the input changes. |
<!-- docs: end hidden content -->

### Accessibility Properties

Either `label` or `labelled-by` is **required**.

## Select All [d2l-selection-select-all]

The `d2l-selection-select-all` is an optional component that provides a checkbox for bulk selecting the selectable elements within the selection control. Its state will also be automatically updated when the state of the selectable elements change.

In the example below, setting `selection-for` to `other-list` demonstrates the ability to use `d2l-selection-select-all` for `d2l-select-input` outside of the custom selection element.

<!-- docs: demo live name:d2l-selection-select-all display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-action.js';
  import '@brightspace-ui/core/components/selection/selection-input.js';
  import '@brightspace-ui/core/components/selection/selection-select-all.js';
  import '@brightspace-ui/core/components/selection/demo/demo-selection.js';
</script>
<!-- docs: start hidden content -->
<style>
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    align-items: center;
    display: flex;
    list-style-type: none;
  }
  div {
    align-items: center;
    display: flex;
  }
  d2l-selection-input {
    margin-right: 10px;
  }
  #other-list {
    padding-top: 1rem;
  }
</style>
<!-- docs: end hidden content -->
<d2l-demo-selection>
  <div>
    <d2l-selection-select-all></d2l-selection-select-all>
    <d2l-selection-action text="Bookmark" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
  </div>
  <ul>
    <li><d2l-selection-input key="geo" label="Geography"></d2l-selection-input>List 1 item 1</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>List 1 item 2</li>
  </ul>
</d2l-demo-selection>
<d2l-demo-selection id="other-list">
  <ul>
    <li><d2l-selection-input key="geo" label="Geography"></d2l-selection-input>List 2 item 1</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>List 2 item 2</li>
  </ul>
</d2l-demo-selection>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `disabled` | Boolean | Disables the select all checkbox |
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |
<!-- docs: end hidden content -->

## Selection Summary [d2l-selection-summary]

The `d2l-selection-summary` is an optional component that shows a simple count of the selected items within the selection control.

In the example below, setting `selection-for` to `other-list` demonstrates the ability to use `d2l-selection-summary` for `d2l-select-input` outside of the custom selection element.

<!-- docs: demo live name:d2l-selection-summary display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-input.js';
  import '@brightspace-ui/core/components/selection/selection-summary.js';
  import '@brightspace-ui/core/components/selection/demo/demo-selection.js';
</script>
<!-- docs: start hidden content -->
<style>
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    align-items: center;
    display: flex;
    list-style-type: none;
  }
  div {
    align-items: center;
    display: flex;
  }
  d2l-selection-input {
    margin-right: 10px;
  }
  #other-list {
    padding-top: 1rem;
  }
</style>
<!-- docs: end hidden content -->
<d2l-demo-selection>
  <div>
    <d2l-selection-action text="Bookmark" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
    <d2l-selection-summary></d2l-selection-summary>
  </div>
  <ul>
    <li><d2l-selection-input key="geo" label="Geography"></d2l-selection-input>List 1 item 1</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>List 1 item 2</li>
  </ul>
</d2l-demo-selection>
<d2l-demo-selection id="other-list">
  <ul>
    <li><d2l-selection-input key="geo" label="Geography"></d2l-selection-input>List 2 item 1</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>List 2 item 2</li>
  </ul>
</d2l-demo-selection>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `no-selection-text` | String | Text to display if no items are selected. By default, the "0 selected" message is displayed. |
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |
<!-- docs: end hidden content -->
