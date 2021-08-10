# Selection

The selection components (`d2l-selection-action`, `d2l-selection-input`, `d2l-selection-select-all`, `d2l-selection-summary`, `d2l-selection-action`) are low-level components that provide the ability to create selection interfaces with select-all and bulk-action behaviours.

![Selection](./screenshots/selection-multiple.png?raw=true)

![Selection](./screenshots/selection-single.png?raw=true)

## SelectionMixin

The selection components above work with a component that extends the `SelectionMixin`, which acts like a controller for the checkboxes, radios, actions, etc. The `d2l-selection-input` component must be placed _within_ the component that extends the `SelectionMixin`.  The other selection components may also be placed inside the `SelectionMixin` component, or in the same DOM scope with the `selection-for` attribute set to the id of that component.

The `d2l-list` already extends `SelectionMixin` and should always be used for lists, however a custom selection control can be easily defined to enable the use of these selection controls in different semantic contexts or radically different layouts. The `SelectionMixin` defines the `selection-single` attribute that consumers can specify for single selection behaviour.

```javascript
import { html, LitElement } from 'lit-element/lit-element.js';
import { SelectionMixin } from '@brightspace-ui/core/components/selection-mixin.js';

class CustomSelection extends SelectionMixin(LitElement) {
  render() {
    return html`
      <slot></slot>
    `;
  }
}
customElements.define('d2l-custom-selection', CustomSelection);
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `selection-single` | Boolean | Whether to render with single selection behaviour. If `selection-single` is specified, the nested `d2l-selection-input` elements will render radios instead of checkboxes, and the selection component will maintain a single selected item. |

The selection components can then be used within the custom selection component as shown below.

```html
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-action.js';
  import '@brightspace-ui/core/components/selection/selection-input.js';
  import '@brightspace-ui/core/components/selection/selection-select-all.js';
  import '@brightspace-ui/core/components/selection/selection-summary.js';
</script>
<d2l-custom-selection>
  <div>
    <d2l-selection-select-all></d2l-selection-select-all>
    <d2l-selection-action text="Bookmark" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
    <d2l-selection-action text="Settings" icon="tier1:gear"></d2l-selection-action>
    <d2l-selection-summary></d2l-selection-summary>
  </div>
  <ul>
    <li><d2l-selection-input key="geo" label="Geography" selected></d2l-selection-input>Geography</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>Science</li>
    <li><d2l-selection-input key="mth" label="Math"></d2l-selection-input>Math</li>
  </ul>
</d2l-custom-selection>
```

Or, the non-`d2l-selection-input` components can be used outside the custom selection component as long as they are in the same DOM scope:

```html
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-action.js';
  import '@brightspace-ui/core/components/selection/selection-input.js';
  import '@brightspace-ui/core/components/selection/selection-select-all.js';
  import '@brightspace-ui/core/components/selection/selection-summary.js';
</script>
<div>
  <d2l-selection-select-all selection-for="custom"></d2l-selection-select-all>
  <d2l-selection-action selection-for="custom" text="Bookmark" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
  <d2l-selection-action selection-for="custom" text="Settings" icon="tier1:gear"></d2l-selection-action>
  <d2l-selection-summary selection-for="custom"></d2l-selection-summary>
</div>
<d2l-custom-selection id="custom">
  <ul>
    <li><d2l-selection-input key="geo" label="Geography" selected></d2l-selection-input>Geography</li>
    <li><d2l-selection-input key="sci" label="Science"></d2l-selection-input>Science</li>
    <li><d2l-selection-input key="mth" label="Math"></d2l-selection-input>Math</li>
  </ul>
</d2l-custom-selection>
```

## d2l-selection-action

The `d2l-selection-action` is an optional component that provides a button for actions associated with the selection component (ex. bulk actions). The `requires-selection` attribute may be specified to indicate that the button should be non-interactive if nothing is selected.

**Properties:**

| Property | Type | Description |
|--|--|--|
| `icon` | String | Preset icon key (e.g. "tier1:gear"). |
| `requires-selection` | Boolean | Whether the action requires one or more selected items. If no items are selected, the action button will be focusable and a hint displayed in a tooltip. |
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |
| `text` | String, required | Text to be shown for the action. |

**Events:**

| Event | Description |
|--|--|
| `d2l-selection-action-click` | Dispatched when the user clicks the action button. The `SelectionInfo` is provided as the event `detail`. If `requires-selection` was specified then the event will only be dispatched if items are selected. |

## d2l-selection-input

The `d2l-selection-input` is a required component in selection controls - without it, there wouldn't be anything for the user to select! Note: `d2l-list-item` already provides a selection input for selectable list items. If `d2l-selection-input` is placed within a selection control that specifies `selection-single`, then radios will be rendered instead of checkboxes.

**Properties:**

| Property | Type | Description |
|--|--|--|
| `key` | String, required | Key to identify the the selectable. |
| `label` | String | Accessible hidden label for the input. |
| `labelled-by` | String | Id reference to the accessible label for the input. **Note:** if specified, it must reference an element in the same DOM context. |
| `selected` | Boolean | State of the input. |

**Accessibility:** either `label` or `labelled-by` is required.

**Events:**

| Event | Description |
|--|--|
| `d2l-selection-change` | Dispatched when the state of the input changes. |

## d2l-selection-select-all

The `d2l-selection-select-all` is an optional component that provides a checkbox for bulk selecting the selectable elements within the selection control. Its state will also be automatically updated when the state of the selectable elements change.

**Properties:**

| Property | Type | Description |
|--|--|--|
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |

## d2l-selection-summary

The `d2l-selection-summary` is an optional component that shows a simple count of the selected items within the selection control.

**Properties:**

| Property | Type | Description |
|--|--|--|
| `no-selection-text` | String | Text to display if no items are selected. By default, the "0 selected" message is displayed. |
| `selection-for` | String | Id of the corresponding `SelectionMixin` component, if not placed within it. |

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
