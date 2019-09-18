**In Development**

# List Component

The `d2l-list` is the container to create a styled list. It requires the use of `d2l-list-item` as its children.

## Usage

Import

```js
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
```

Then add the `d2l-list` component to your html and use the `d2l-list-item` to define the `d2l-list`'s children.

```html
<d2l-list>
    <d2l-list-item>Item 1</d2l-list-item>
    <d2l-list-item>Item 2</d2l-list-item>
    <d2l-list-item>Item 3</d2l-list-item>
</d2l-list>
```

Output

![Basic List](./screenshots/d2l-list-basic.png?raw=true)

# d2l-list

`d2l-list` can be modified to display the data in slightly different ways.

## Signature

```html
<d2l-list [divider-mode="[none|all|between]"] [divider-extend] [hover-effect]>
    <d2l-list-item>...</d2l-list-item>
    ...
    <d2l-list-item>...</d2l-list-item>
</d2l-list>
```

## Attributes

- **divider-mode**: Describes which dividers will be shown for the list.
  - *all* (default): Shows all the dividers including dividers on the top and bottom of the list.
  - *between*: Only show the dividers between list items. The top and bottom dividers are hidden.
  - *none*: Show no dividers.
- **divider-extend**: A boolean attributes that extends the length of the dividers so the space between the list item contents and the left and right edges of the list dividers.
- **hover-effect**: When the list item is interactive (selectable or link) then this applies a hover effect for the background. In the selectable case it also adds background color and highlights the divider of selected items.

## Events

- **d2l-list-selection-change**: Whenever a list item is selected this `change` event will be emitted with a list of items that are current selected.
It returns `event.detial.key` and `event.detial.selected` where `key` is the key of the element that has changed and `selected` is the boolean value that it changed to.

## Public Methods

- **toggleSelectAll()**: Checks all list items if current state is `none` or `indeterminate`. Removes the check from all list items if in the `all` state. Note this will suppress the events of items being selected.
- **getSelectedKeys()**: Returns the list of keys of list items that are selected.
- **getSelectionState()**: Returns a selectableListStates that describes the current state.

## Helpers

### selectableListStates
An enum for the different states of a list selection.

Use:

```js
import { selectableListStates } from '@brightspace-ui/core/components/list/list.js';

selectableListStates.none
selectableListStates.indeterminate
selectableListStates.all
```

Values:

-**none**: There are no rendered list items that are selected.
-**indeterminate**: There are some but not all list items that are rendered are selected.
-**all**: All rendered list items are selected.

# d2l-list-item

`d2l-list-item` defines the items for a `d2l-list`.

## Signature

```html
<d2l-list-item [breakpoints=":array" ] [illustration-outside] [href=":url"] [selected] [key=":string"] [selectable]>
    [slot: illustration]
    [slot: default]
    [slot: actions]
</d2l-list-item>
```

## Attributes

- **breakpoints**: Define breakpoints by pixels on when things should scale. There are four different breakpoints so only the 4 biggest breakpoints will be used. If you use less than 4 breakpoints then you will skip a middle breakpoint and the first and last break points will map to the biggest and smallest visuals. Default: [842, 636, 580, 0].
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
- **href**: This item will link to the given page.
- **illustration-outside**: Whether the illustration is outside of the dividers.
- **selectable**: This item can be selected.
- **selected**: This item is selected.

## Slots

- **default**: This is for the main content area. You can add styles to the elements in this slot.
- **illustration**: Responsive slot for images.
- **actions**: This is for actions. They will show up on the right side.

# d2l-list-item-content

`d2l-list-item-content` defines the text content for a `d2l-list-item`.

## Signature

```html
<d2l-list-item-content>
    [slot: default]
    [slot: secondary]
</d2l-list-item-content>
```

## Slots

- **default**: This slot gives text the style `d2l-body-compact` and if the `d2l-list-item` is a link then turns it blue and adds a hover effect.
- **secondary**: Adds text under the `default` slot and sets the font to d2l-body-small. If `selectable` and `hover-effect` turned on updates the color of the text on selected elements to meet accessibility requirements.
