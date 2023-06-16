# Lists

A list displays a collection of objects of the same type. A list is primarily used in order to help users navigate to a full-page representation of a single object, or to select several items and execute an action on them.

<!-- docs: demo display:block autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
  import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/core/components/menu/menu-item.js';
</script>

<d2l-list>
  <d2l-list-item label="List Item 1">
    <d2l-list-item-content>
      <div>Regular list item</div>
      <div slot="secondary">Secondary information</div>
    </d2l-list-item-content>
  </d2l-list-item>
  <d2l-list-item href="http://www.d2l.com" key="1" label="List Item 2">
    <img slot="illustration" src="https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg" />
    <d2l-list-item-content>
      <div>More exciting list item</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
    <div slot="actions">
      <d2l-dropdown-more text="Open">
        <d2l-dropdown-menu>
          <d2l-menu label="Menu">
            <d2l-menu-item text="Action 1"></d2l-menu-item>
            <d2l-menu-item text="Action 2"></d2l-menu-item>
          </d2l-menu>
        </d2l-dropdown-menu>
      </d2l-dropdown-more>
    </div>
  </d2l-list-item>
  <d2l-list-item href="http://www.d2l.com" selectable key="2" selected label="List Item 3">
    <img slot="illustration" src="https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg">
    <d2l-list-item-content>
      <div>Selectable list item (selected)</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
</d2l-list>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Lists are good when items may have different attributes, and if presented in a table would have many empty cells in the columns
* Tables take up a lot of horizontal space, and don’t really have responsive behaviour other than offscreen scroll
* Tables have fixed width columns – every column’s size is driven by the largest element. If the contents of a certain “column” are highly variable, consider a list
* Generally, the larger touch target of the list is easier to use than needing to target a link in the first column of a table, if the primary use case is navigation & selection rather than analysis, consider a list
<!-- docs: end dos -->

<!-- docs: start donts -->
* If your data is highly numerical, or a complex dataset, and making comparisons across column is essential to the user’s workflow, consider a table
* If the user is expected to frequently change the sorting order, the sortable column headers of tables speed up this process
* Lists don’t have headings, so for views where additional information would otherwise be repeated in every individual item, consider a table
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Accessibility

If your list items are selectable or have secondary action buttons, use the ARIA layout grid on `d2l-list` to make it easy to navigate between items. This makes the entire list a single tab stop, and then the user can use the arrow keys to navigate between various list rows and actions in the list item.

**Benefits of the ARIA layout grid:**

* Specifying the list as a single tab stop using the ARIA layout grid allows the user to navigate from selecting items to applying actions on their selection with a single tab
* The layout grid allows the user to arrow “down” the column of checkboxes (or action buttons) without all the extra tab stops in-between

**Guidelines of specifying the ARIA layout Grid:**

* The item selection manipulators should be in a single pseudo-column
* All list item content for a list item should reside in a single pseudo-column
* Each Secondary Action Button should reside in it’s own pseudo-column
* Do not use the ARIA layout grid if there are multiple links or navigation actions in the list item content

**Implementation Details:**

When using `d2l-list`, the `grid` attribute will enable the table-like keyboard grid that allows a user to traverse list items with their keyboard. Left and right will switch if using an RTL language.

* **ArrowLeft** moves to the next left item in a row
* **ArrowRight** moves to the next right item in a row
* **ArrowUp** moves to the same item in the row above, if available
* **ArrowDown** moves to the same item in the row below, if available
* **PageUp** moves to the same item in the row **five** rows above, if available
* **PageDown** moves to the same item in the row **five** rows below, if available
* **Home** moves to the first item in the row
* **Ctrl+Home** moves to the first item of the first row
* **End** moves to the last item in the row
* **Ctrl+End** moves to the last item of the last row
* **Space** and **Enter** simulate a click on the focused item

**Note about actions:** Actions must be placed in the `actions` slot. The grid does not support actions/focusable items that are placed in the content area. The list item currently only supports navigation with `href` as the content action.

## List [d2l-list]

The `d2l-list` is the container to create a styled list of items using `d2l-list-item` or `d2l-list-item-button`. It provides the appropriate `list` semantics as well as options for displaying separators, etc.

<!-- docs: demo code properties name:d2l-list display:block autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
</script>

<d2l-list>
  <d2l-list-item selectable label="List Item 1">
    <d2l-list-item-content>
      <div>Regular list item</div>
      <div slot="secondary">Secondary information</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
  <d2l-list-item selectable label="List Item 2">
    <d2l-list-item-content>
      <div>Regular list item 2</div>
      <div slot="secondary">Secondary information</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
</d2l-list>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `drag-multiple` | Boolean | Whether the user can drag multiple items |
| `grid` | Boolean | Enables keyboard grid for supported list items. See [Accessibility](#accessibility). |
| `label` | String | Sets an accessible label. For use when the list context is unclear. This property is only valid on top-level lists and will have no effect on nested lists. |
| `selection-single` | Boolean | Whether to render with single selection behaviour. If `selection-single` is specified, the list-items will render with radios instead of checkboxes, and the list component will maintain a single selected item. |
| `separators` | String | Display separators (`all` (default), `between`, `none`) |
| `extend-separators` | Boolean | Whether to extend the separators beyond the content's edge |

### Events

- `d2l-list-selection-change`: dispatched when the selection state changes; event detail includes the `key` and `selected` state of the item
- `d2l-list-selection-changes`: dispatched once for a set of selection state changes (ex. select-all); event detail includes an array of objects where each object contains the `key` and `selected` state for each changed item
<!-- docs: end hidden content -->

### Methods

- `getItems()` (Array): returns the list items within the list
- `getListItemByKey(key)` (ListItem): returns the list item element from the root or nested lists for the specified key
- `getListItemCount()` (Number): returns the number of items within the list
- `getListItemIndex(item)` (Object): returns the index of the given element within the list
- `getSelectedListItems(includeNested)` (Array): returns the selected items; pass `true` to include nested lists
- `getSelectionInfo(includeNested)` (Object): returns a `SelectionInfo` object containing the `state` (`none`, `some`, `all`), and the `keys` (Array) for the selected items

## Selection Lists

The `d2l-list` supports selectable items within a list, including both single and multi selection. Selection is enabled when `d2l-list-item`s have the `selectable` attribute. When items are selectable, multiple selection is the default behaviour, however the `selection-single` attribute can be applied to the `d2l-list` to enable single selection. A `d2l-list-controls` component can be added to `d2l-list`'s `controls` slot to provide select-all and bulk actions.

### Accessibility Properties

If a `d2l-list-item` is selectable then it should have a `label` attribute that corresponds to the hidden label for the checkbox.

### Example

<!-- docs: demo code display:block autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-controls.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
  import '@brightspace-ui/core/components/selection/selection-action.js';
</script>

<d2l-list>
  <d2l-list-controls slot="controls" no-sticky>
    <d2l-selection-action icon="tier1:delete" text="Delete" requires-selection></d2l-selection-action>
  </d2l-list-controls>
  <d2l-list-item selectable key="eth" label="Earth Sciences">
    <d2l-list-item-content>
      <div>Earth Sciences</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
  <d2l-list-item selectable key="ast" label="Astronomy">
    <d2l-list-item-content>
      <div>Astronomy</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
</d2l-list>
```

## Expandable Lists

The `d2l-list` supports expandable items within a list. Expand and collapse toggle is enabled when `d2l-list-item`s have the `expandable` and `key` attributes set. When items are expandable the default state is collapsed. If you would like the default state to be expanded, add the `expanded` attribute to the `d2l-list-item`.

### Expandable List Accessibility Properties

If a `d2l-list-item` is expandable then it should have a `label` attribute that corresponds to the hidden label for the expand/collapse toggle.

### Expandable List Example

<!-- docs: demo code display:block autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-controls.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
  import '@brightspace-ui/core/components/selection/selection-action.js';
</script>

<d2l-list grid>
  <d2l-list-controls slot="controls">
    <d2l-selection-action icon="tier1:delete" text="Delete" requires-selection></d2l-selection-action>
  </d2l-list-controls>
  <d2l-list-item selectable expandable key="expand-1" label="Expandable item #1">
    <d2l-list-item-content>
      <div>Expandable item #1</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
    <d2l-list grid slot="nested">
      <d2l-list-item selectable key="nested-1" label="Nested 1">
        <d2l-list-item-content><div>Nested item #1</div></d2l-list-item-content>
      </d2l-list-item>
      <d2l-list-item selectable key="nested-2" label="Nested 2">
        <d2l-list-item-content><div>Nested item #2</div></d2l-list-item-content>
      </d2l-list-item>
    </d2l-list>
  </d2l-list-item>
  <d2l-list-item selectable expandable expanded key="expand-2" label="Expandable item #2">
    <d2l-list-item-content>
      <div>Expandable Item #2</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
    <d2l-list grid slot="nested">
      <d2l-list-item selectable key="nested-3" label="Nested 3">
        <d2l-list-item-content><div>Nested item #3</div></d2l-list-item-content>
      </d2l-list-item>
      <d2l-list-item selectable key="nested-4" label="Nested 4">
        <d2l-list-item-content><div>Nested item #4</div></d2l-list-item-content>
      </d2l-list-item>
    </d2l-list>
  </d2l-list-item>
  <d2l-list-item selectable key="expand-3" label="Item with no children">
    <d2l-list-item-content>
      <div>Item with no children</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
</d2l-list>
```

## Pageable Lists

Load-More paging functionality can be implemented in lists by placing a `d2l-pager-load-more` in `d2l-list`'s `pager` slot. The consumer must handle the `d2l-pager-load-more` event by loading more items, updating the pager state, and signalling completion by calling `complete()` on the event detail. Focus will be automatically moved on the first new item once complete. See [Paging](../../components/paging) for more details.

## Drag & Drop Lists

The `d2l-list` supports drag & drop.

The `d2l-list` is simply a rendering component, so there is some light work involved in hooking up this behaviour. In order for items to be draggable, they must have their `draggable` and `key` attributes set. Optionally, the `drop-nested` attribute can be applied to items to indicate whether other items can be dropped as nested children on the item.

Reordering and re-rendering is the consuming component's responsibility. For a simple flat list, listen for the `d2l-list-item-position-change` event and call the `reorder` helper method. Alternatively, or for more complex lists such as those with nested lists, listen for the `d2l-list-items-move` event on the root list and update the consumer data using the provided source and target event detail.

### Accessibility Properties

If an item is draggable, the `drag-handle-text` attribute should be used to provide an accessible label for assistive technology in keyboard mode.

### Example

<!-- docs: demo code display:block autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
  import { css, html, LitElement } from 'lit';

  class ListDemoDragAndDropUsage extends LitElement {
    static get properties() {
      return {
        list: { type: Array }
      };
    }

    constructor() {
      super();
      this.list = [
        { key: '1', content: 'Initially first list item' },
        { key: '2', content: 'Initially second list item' },
        { key: '3', content: 'Initially third list item' }
      ];
    }

    render() {
      const listItems = this.list.map((item) => {
        return html`
          <d2l-list-item draggable key="${item.key}" label="Draggable List Item">
            <d2l-list-item-content>
              ${item.content}
              <div slot="secondary">Secondary information</div>
            </d2l-list-item-content>
          </d2l-list-item>
        `;
      });

      return html`
        <d2l-list @d2l-list-item-position-change="${this._moveItems}">
          ${listItems}
        </d2l-list>
      `;
    }

    _moveItems(e) {
      e.detail.reorder(this.list, { keyFn: (item) => item.key });
      this.requestUpdate('list', []);
    }
  }
  customElements.define('d2l-my-drag-drop-elem', ListDemoDragAndDropUsage);
</script>
<d2l-my-drag-drop-elem></d2l-my-drag-drop-elem>
```

## List Controls [d2l-list-controls]

The `d2l-list-controls` component can be placed in the `d2l-list`'s `controls` slot to provide a select-all checkbox, summary, a slot for `d2l-selection-action`s, and overflow-group behaviour.

<!-- docs: demo code properties name:d2l-list-controls display:block autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-controls.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
  import '@brightspace-ui/core/components/selection/selection-action.js';
</script>
<!-- docs: start hidden content -->
<style>
  #demo-element {
    margin-bottom: 300px;
    margin-top: 0;
  }
</style>
<!-- docs: end hidden content -->

<d2l-list>
  <d2l-list-controls slot="controls">
    <d2l-selection-action icon="tier1:delete" text="Delete" requires-selection></d2l-selection-action>
    <d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
  </d2l-list-controls>
  <d2l-list-item selectable key="eth" label="Earth Sciences">
    <d2l-list-item-content>
      <div>Earth Sciences</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
  <d2l-list-item selectable key="ast" label="Astronomy">
    <d2l-list-item-content>
      <div>Astronomy</div>
      <div slot="supporting-info">Supporting information</div>
    </d2l-list-item-content>
  </d2l-list-item>
</d2l-list>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `no-selection` | Boolean | Whether to render select-all and selection summary |
| `no-sticky` | Boolean | Disables sticky positioning for the controls |
| `select-all-pages-allowed` | Boolean | Whether all pages can be selected |
<!-- docs: end hidden content -->

## List Item [d2l-list-item]

The `d2l-list-item` provides the appropriate `listitem` semantics for children within a list. It also provides some basic layout, breakpoints for responsiveness, a navigation link for the primary action, and selection.

<!-- docs: demo code properties name:d2l-list-item autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-icon.js';
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
</script>

<d2l-list>
  <d2l-list-item href="http://www.d2l.com" selectable key="3" label="Geomorphology and GIS">
    <img slot="illustration" src="https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg" />
    <d2l-list-item-content>
      <div>Geomorphology and GIS </div>
      <div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain...</div>
    </d2l-list-item-content>
    <div slot="actions">
      <d2l-button-icon text="My Button" icon="tier1:preview"></d2l-button-icon>
    </div>
  </d2l-list-item>
</d2l-list>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `breakpoints` | Array | Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used. |
| `draggable` |  Boolean | Whether the item is draggable |
| `drag-handle-text` | String | The drag-handle label for assistive technology. If implementing drag & drop, you should change this to dynamically announce what the drag-handle is moving for assistive technology in keyboard mode. |
| `drag-target-handle-only` | Boolean | Make the drag target the drag handle only. |
| `drop-nested` | Boolean | Whether nested items can be dropped on this item |
| `drop-text` | String | Text to drag and drop |
| `expandable` | Boolean | Whether or not to show the expand/collapse toggle. |
| `expanded` | Boolean | Whether the item is expanded. Requires `expandable` to be set. |
| `href` | String | Address of item link if navigable |
| `key` | String | Value to identify item if selectable or draggable |
| `label` | String | Explicitly defined label for the element |
| `labelled-by` | String | The id of element that provides the label for this element |
| `no-primary-action` | Boolean | Whether to disable rendering the entire item as the primary action. Required if slotted content is interactive. |
| `padding-type` | String | List item whitespace (`normal` (default), `none`)|
| `selectable` | Boolean | Indicates an input should be rendered for selecting the item |
| `selected` | Boolean | Whether the item is selected |
| `selection-disabled` | Boolean | Disables selection |
| `skeleton` | Boolean | Renders the input as a skeleton loader |

### Methods

- `highlight()`: highlights the item
- `scrollToItem(alignToTop=true)`: scrolls to the item. See [Element.scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) for definition of alignToTop.
- `scrollToAndHighlight(alignToTop=true)`: scrolls to the item and then highlights it. . See [Element.scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) for definition of alignToTop.

### Events

- `d2l-list-item-link-click`: dispatched when the item's primary link action is clicked
- `d2l-list-item-expand-collapse-toggled`: dispatched when the item's expand/collapse toggle is clicked
<!-- docs: end hidden content -->

### Breakpoints Property

- `breakpoints` (Array): Breakpoints for responsiveness (`[842, 636, 580, 0]`), in pixels. There are four different breakpoints and only the four largest breakpoints will be used. If less breakpoints are used, then skip a middle breakpoint so that the first and last breakpoints will map to the largest and smallest layouts.
  - Breakpoint 0
    - Image: max dimensions: `width: 90px` and `height: 52px` and has `18px margin` from the main content;
    - default break: `x < 580px` where `x` is the width of the component.
  - Breakpoint 1
    - Image: max dimensions: `width: 120px` and `height: 71px` and has `20px margin` from the main content;
    - default break: `581px < x < 636px` where `x` is the width of the component.
  - Breakpoint 2
    - Image: max dimensions: `width: 180px` and `height: 102px` and has `20px margin` from the main content;
    - default break: `637px < x < 842px`  where `x` is the width of the component.
  - Breakpoint 3
    - Image: max dimensions: `width: 216px` and `height: 120px` and has `20px margin` from the main content;
    - default break: `843px < x`  where `x` is the width of the component.

## Button List Item [d2l-list-item-button]

The `d2l-list-item-button` provides the same functionality as `d2l-list-item` except with button semantics for its primary action.

<!-- docs: demo code properties name:d2l-list-item-button display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item-button.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
</script>

<d2l-list>
  <d2l-list-item-button href="http://www.d2l.com" selectable key="1" label="Geomorphology and GIS">
    <d2l-list-item-content>
      <div>Geomorphology and GIS </div>
      <div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain...</div>
    </d2l-list-item-content>
  </d2l-list-item-button>
</d2l-list>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `breakpoints` | Array | Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used. |
| `button-disabled` | Boolean | Disables the primary action button |
| `draggable` |  Boolean | Whether the item is draggable |
| `drag-handle-text` | String | The drag-handle label for assistive technology. If implementing drag & drop, you should change this to dynamically announce what the drag-handle is moving for assistive technology in keyboard mode. |
| `drop-nested` | Boolean | Whether nested items can be dropped on this item |
| `drop-text` | String | Text to drag and drop |
| `expandable` | Boolean | Whether or not to show the expand/collapse toggle. |
| `expanded` | Boolean | Whether the item is expanded. Requires `expandable` to be set. |
| `key` | String | Value to identify item if selectable or draggable |
| `label` | String | Explicitly defined label for the element |
| `labelled-by` | String | The id of element that provides the label for this element |
| `padding-type` | String | List item whitespace (`normal` (default), `none`)|
| `selectable` | Boolean | Indicates an input should be rendered for selecting the item |
| `selected` | Boolean | Whether the item is selected |
| `selection-disabled` | Boolean | Disables selection |
| `skeleton` | Boolean | Renders the input as a skeleton loader |

### Events

- `d2l-list-item-button-click`: dispatched when the item's primary button action is clicked
- `d2l-list-item-expand-collapse-toggled`: dispatched when the item's expand/collapse toggle is clicked
<!-- docs: end hidden content -->

## ListItemMixin

Want to maintain consistency with `d2l-list-item` but need more modularity? This mixin is for you! This mixin allows you to make a component into a list item without requiring custom styling. All of the properties and functionality from `d2l-list-item` (listed above) will be added to your new component.

### How to use

Import
```javascript
import { ListItemMixin } from './list-item-mixin.js';

class ListItem extends ListItemMixin(LitElement) {
...
```

How add the styles:
```javascript
static get styles() {
  return [ super.styles ];
}
```

How to render the list item:
```javascript
render() {
  return this._renderListItem({
    illustration: html`[Image HTML here]`,
    content: html`[Content here such as d2l-list-item-content]`,
    actions: html`actions here`
  });
}
```
Where the parameters correspond to the slots of `d2l-list-item`:
- illustration (TemplateResult):  Provide an illustration for your list item.
- content (TemplateResult): Core content of the list item, such as a d2l-list-item-content element.
- actions (TemplateResult): Secondary actions for the list item.
- nested (TemplateResult): Optional `d2l-list` for a nested list.

## List Item Content

The `d2l-list-item-content` provides additional consistent layout for primary and secondary text in item content. It may be used with or without the `illustration` and `action` slots mentioned above.

<!-- docs: demo code properties name:d2l-list-item-content display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/list/list-item-content.js';
</script>

<d2l-list>
  <d2l-list-item label="List Item 1">
    <d2l-list-item-content>
      <div>Item 1</div>
      <div slot="secondary">Secondary Info for item 1</div>
      <div slot="supporting-info">Supporting info for item 1</div>
    </d2l-list-item-content>
  </d2l-list-item>
</d2l-list>
```

## Event Details: @d2l-list-item-position-change

This event includes a detail object with helper methods attached to it.

**Methods**

- `announceMove(list, {announceFn, keyFn})`: Announces a move event to screenreaders
  - `list`: The array of items
  - `announceFn(any, Number)`: A callback function that takes a given item in the array and its index, and returns the text to announce
  - `keyFn(any)`: A callback function that takes a given item in the array and returns its key
- `fetchPosition(list, key, keyFn)`:
  - `list`: The array of items
  - `key`: The key of the item to fetch the position of
  - `keyFn(any)`: A callback function that takes a given item in the array and returns its key
- `reorder(list, {announceFn, keyFn})`: Reorders an array of items in-place using the information from the event
  - `list`: The array of items
  - `announceFn(any, Number) (optional)`: A callback function that takes a given item in the array and its index, and returns the text to announce
  - `keyFn(any)`: A callback function that takes a given item in the array and returns its key

## Event Details: @d2l-list-items-move

**Properties**

- `keyboardActive`: (Boolean) Whether the drag handle is in keyboard mode
- `sourceItems`: (Array) Items being moved
- `target`: (Object) The target reference `item` where items are being moved, and the `location` (`moveLocations.above`, `moveLocations.below`, or `moveLocations.nest`)

<!-- docs: start hidden content -->
## Future Improvements

- Paging: integration with "scroll" and "numeric" paging mechanisms

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
