<span style="color:red; font-size:24px; text-transform: uppercase;">**In Development**</span>

# List Component

The `d2l-list` is the container to create a styled list. It requires the use of `d2l-list-item` as it's children.

## Usage

Import
```js
import '@brightspace-ui/core/components/list/list.js';
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
<d2l-list [divider="[all|top|bottom|middle|none]"] [divider-extend]>
	<d2l-list-item>...</d2l-list-item>
	...
	<d2l-list-item>...</d2l-list-item>
</d2l-list>
```
## Attributes
- **divider**: Describes which dividers will be shown for the list.
  - *all* (default): Shows all the dividers including dividers on the top and bottom of the list.
  - *top*: Shows all the dividers except for the one at the bottom of the list.
  - *bottom*: Shows all the dividers except for the one at the top of the list.
  - *middle*: Only show the dividers between list items. The top and bottom dividers are hidden.
  - *none*: Show no dividers.
- **divider-extend**: A boolean attributes that extends the length of the dividers so the space between the list item contents and the left and right edges of the list dividers.

## Slot
- **default**: Only allows `d2l-list-item` in the slot. Can take multiple `d2l-list-item`s.

## Styles
-**d2l-item-divider-hover**: Add this class to enable showing the dividers on hover. This functionality will be removed and was added for testing hover states.

# d2l-list-item
`d2l-list-item` defines the items for a `d2l-list`.
## Signature
```html
<d2l-list-item>
	[slot: illustration-outer]
	[slot: illustration]
	[slot: default]
	[slot: actions]
</d2l-list>
```

## Slots
 - **default**: This is for the main content area. You can add styles to the elements in this slot.
   - *d2l-list-item-text*: This will act as the primary text. Limit is the text to two lines and will auto wrap. It will also gain all the hover styles.
   - *d2l-list-item-text-secondary*: Secondary text which will show up under the primary text. Proper padding will be applied.
   - *d2l-list-item-text-secondary-responsive*: Same as `d2l-list-item-text-secondary` but will disappear at smaller breakpoints.
 - **illustration**: Responsive slot for images. This one will be within the dividers.
  - **illustration-outer**: Responsive slot for images. This one will be outside the dividers.
  - **actions**: This is for actions. They will show up on the right side.

