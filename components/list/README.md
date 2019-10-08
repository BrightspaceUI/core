<span style="color:red; font-size:24px; text-transform: uppercase;">**In Development**</span>

# List Component

The `d2l-list` is the container to create a styled list. It requires the use of `d2l-list-item` as its children.

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
<d2l-list [separators="[none|all|between]"] [extend-separators]>
	<d2l-list-item>...</d2l-list-item>
	...
	<d2l-list-item>...</d2l-list-item>
</d2l-list>
```
## Attributes
- **separators**: Describes which separators will be shown for the list.
  - *all* (default): Shows all the separators including above and below the list.
  - *between*: Only show the separators between list items, excluding above and below the list.
  - *none*: Show no separators.
- **extend-separators**: A boolean attributes that extends the length of the separators so the space between the list item contents and the left and right edges of the list separators.

# d2l-list-item
`d2l-list-item` defines the items for a `d2l-list`.
## Signature
```html
<d2l-list-item [breakpoints="array" ][illustration-outside]>
	[slot: illustration]
	[slot: default]
	[slot: actions]
</d2l-list>
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
 - **illustration-outside**: Whether the illustration is outside of the separators.

## Slots
 - **default**: This is for the main content area. You can add styles to the elements in this slot.
 - **illustration**: Responsive slot for images.
  - **actions**: This is for actions. They will show up on the right side.
