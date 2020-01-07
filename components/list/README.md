# Lists

## d2l-list

The `d2l-list` is the container to create a styled list of items using `d2l-list-item`. It provide the appropriate `list` semantics as well as options for displaying separators, etc.

![List](./screenshots/list.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item.js';
</script>

<d2l-list>
  <d2l-list-item>...</d2l-list-item>
  <d2l-list-item>...</d2l-list-item>
  ...
</d2l-list>
```

**Properties:**

- `separators` (String): Display separators (`all` (default), `between`, `none`)
- `extend-separators` (Boolean): Whether to extend the separators beyond the content's edge

**Methods:**

- `getSelectionInfo` (Object): gets the `state` (`listSelectionStates`) and `keys` (Array) for the selected items
- `toggleSelectAll`: toggles the selection state of all items

**Events:**

- `d2l-list-selection-change`: dispatched when the selection state changes

## d2l-list-item

The `d2l-list-item` provides the appropriate `listitem` semantics for children within a list. It also provides some basic layout, breakpoints for responsiveness, a link for navigation, and selection.

![List](./screenshots/list-item.png?raw=true)

```html
<d2l-list-item breakpoints="array"
  href="http://www.d2l.com"
  illustration-outside
  key="item1"
  selectable
  selected
  disabled>
  <img src="..." slot="illustration">
  <div>...</div>
  <div slot="actions">
    <d2l-button-icon ...></d2l-button-icon>
    <d2l-button-icon ...></d2l-button-icon>
  </div>
</d2l-list-item>
```

**Properties:**

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
- `href` (String): Address of item link if navigable
- `illustration-outside` (Boolean): Whether the illustration is rendered outside of the separators
- `key` (String): Value to identify item if selectable
- `selectable` (Boolean): Indicates a checkbox should be rendered for selecting the item
- `selected` (Boolean): Whether the item is selected
- `disabled` (Boolean): Whether or not the checkbox is disabled

## d2l-list-content

The `d2l-list-content` provides additional consistent layout for primary and secondary text in item content. It may be used with or without the `illustration` and `action` slots mentioned above.

![List](./screenshots/list-item-content.png?raw=true)

```html
<d2l-list-item>
  <d2l-list-item-content>
    <div>Item 1</div>
    <div slot="secondary">secondary info for item 1</div>
  </d2l-list-item-content>
</d2l-list-item>
```
