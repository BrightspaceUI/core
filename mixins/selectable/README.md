# SelectableMixin

The `SelectableMixin` allows the user to select a component by clicking on the provided `.d2l-select-action` label. The selectable component may or may not use a checkbox to inform the user of the selected status.

![SelectableMixin](./screenshots/selectable.gif?raw=true)

## Usage

Apply the mixin and call `this._renderSelectAction` where you would like to place the select action. You can optionally pass text/html to the action.

You may optionally call `this._renderCheckbox()` to render the checkbox associated with the label.

```js
import { SelectableMixin } from '@brightspace-ui/core/mixins/selectable/selectable-mixin.js';

class MyComponent extends SelectableMixin(LitElement) {

  render() {
    return html`
      ${this._renderCheckbox()}
      ${this._renderSelectAction('Optional label text')}
    `;
  }
}

customElements.define('d2l-my-component', MyComponent);
```

To turn the behaviour on, specify both `selectable` and a unique `key` for the component. Clicking `.d2l-select-action` will toggle the `selected` property on the component.

```html
<d2l-my-component key="uniqueKey" selectable></d2l-my-component>
```

### Events

By default, the event name will be based on the component's constructor in **kebab case**, e.g., `d2l-my-component-selected` for `MyComponent`. This event is fired when a user selects or deselects the component. You may change the event name by setting `this._selectedEventName`:

```js
constructor() {
  super();
  this._selectedEventName = 'd2l-custom-event-name-selected';
}
```

`d2l-my-component-selected`

- `detail`:
  - `key` (String): Unique key of the (de)selected item.
  - `selected` (Boolean): Selected status of the item.
- `bubbles`: `true`

### Properties

- `disabled` (Boolean): The disabled state of the component. Disabled components can't be selected.
- `key` (String): Unique key for the component. Available in the selected event detail.
- `selectable` (Boolean): Turns selectable behaviour on or off.
- `selected` (Boolean): Current state of the component.
