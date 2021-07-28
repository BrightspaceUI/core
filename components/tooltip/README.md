# Tooltips

Tooltips display additional information when users focus or hover on a point of interest.

<!-- docs: demo autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<d2l-button id="tooltip-button">Hover here</d2l-button>
<d2l-tooltip for="tooltip-button" align="start" offset="10">
	Tooltip message example
</d2l-tooltip>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to show error messages during form validation
* Use to provide extra information in an infographic
* Use to provide the “full text” for a truncated value in a tight datagrid or list
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use tooltips for long paragraphs of text
* Don’t use tooltips to repeat text that is already shown
* Don’t allow a tooltip to cover something important (the “hover and cover” anti-pattern)
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Accessibility

**Interactive Target Elements:**

If the tooltip's target is an interactive element then it will automatically be accessibile. [A list of interactive elements can be found here.](https://github.com/BrightspaceUI/core/blob/main/components/tooltip/tooltip.js#L38)

**Static / Custom Target Elements:**

If the tooltip's target is a static or custom element then the target must be both focusable and given an interactive ARIA role. Note, a role should only be added to an element if the role semantically aligns with what the element represents. [A list of interactive roles can be found here.](https://github.com/BrightspaceUI/core/blob/main/components/tooltip/tooltip.js#L52)

Adding roles to custom elements that contain internal interactive elements should be avoided to prevent the element type being announced twice. In situations like these, the tooltip should be moved inside the custom element so that it can be attached directly as shown below:
```html
<my-custom-button>
	#shadow-root (open)
		<button id="my-button">Click Me</button>
		<d2l-tooltip for="my-button">Your tooltip message.</d2l-tooltip>
</my-custom-button>
```
If you need a tooltip in a core component that does not currently support it please create a Github issue.

If you are unable to add a semantically aligned ARIA role or attach the tooltip to an interactive element then accessibility may be inconsistent across different screen readers. In these scenarios, putting critical information inside the tooltip should be avoided because some users may not be able to access it. You should use the `announced` attribute on the `d2l-tooltip` in this case, which will announce the tooltip text when the tooltip is shown and works across many browser/screen reader combinations.

## Tooltip [d2l-tooltip]

The `d2l-tooltip` component is used to display additional information when users focus or hover on a point of interest.

<!-- docs: start hidden content -->
![screenshot of an error tooltip](./screenshots/tooltip-error.png)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-tooltip autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<d2l-input-text placeholder="Hover for Error" id="tooltip-error" aria-invalid="true" style="max-width:250px;"></d2l-input-text>
<d2l-tooltip for="tooltip-error" state="error">
	Your error message will display here
</d2l-tooltip>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `for` | String, required | Provide the `id` of the tooltip's target element. If this attribute is not provided, the tooltip's parent element will be used as its target. Both the tooltip and its target element must be within the same shadow root. |
| `align` | String | Optionally align the tooltip with either the start or end of its target. If not set, the tooltip will attempt be centered. Valid values are: `start` and `end`. |
| `delay` | Number, default: `0` | Provide a delay in milliseconds to prevent the tooltip from opening immediately when hovered. This delay will only apply to hover, not focus. |
| `offset` | Number, default: `16.5` | Adjust the size of the gap between the tooltip and its target |
| `state` | String, default: `info` | The style of the tooltip based on the type of information it displays. Valid values are: `info` and `error`. If you find yourself needing a style that isn't supported by the `state` attribute please create a Github issue. |

### Advanced Properties

| Property | Type | Description |
|--|--|--|
| `announced` | Boolean, default: `false` | Announce the tooltip inner text to screen reader users when the tooltip is shown. Use with custom elements. |
| `boundary` | Object | Optionally provide boundaries to constrain where the tooltip will appear. Valid properties are `"top"`, `"bottom"`, `"left"` and `"right"`. The boundary is relative to the tooltip's [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent). |
| `close-on-click` | Boolean, default: `false` | Causes the tooltip to close when its target is clicked |
| `disable-focus-lock` | Boolean, default: `false` | Disables focus lock so that the tooltip will automatically close when no longer hovered even if it still has focus |
| `force-show` | Boolean, default: `false` | Force the tooltip to stay open as long as it remains `true` |
| `for-type` | String, default: `descriptor` | Accessibility type for the tooltip to specify whether it is the primary label for the target or a secondary descriptor. Valid values are: `label` and `descriptor`. |
| `position` | String | Optionally force the tooltip to open in a certain direction. Valid values are: `top`, `bottom`, `left` and `right`. If no position is provided, the tooltip will open in the first position that has enough space for it in the order: bottom, top, right, left. |

### Events
* `d2l-tooltip-show`: dispatched when the tooltip is opened
* `d2l-tooltip-hide`: dispatched when the tooltip is closed
<!-- docs: end hidden content -->

### Advanced Usages

**Boundaries:**

If no boundaries are provided the union of the `window` or `iframe` document and the viewport will be used. Custom boundaries should be used sparingly; however, it might be necessary to constrain a tooltip to improve user experience or to prevent it from being cut off if it has an ancestor with `overflow: hidden;`.

This can be done with the `boundary` attribute that allows any of the tooltip's `"top"`, `"bottom"`, `"left"` and `"right"` to be constrained. Boundaries are defined relative on the tooltip's [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent) meaning a boundary of `{"top": 0, "bottom": 0, "left": 0, "right": 0}` will constrain the tooltip so that it opens within its offset parent's bounds.

In the following example to constrain the tooltip to the dashed boundary we can set the top boundary to `50`, the bottom boundary to `10`, the left boundary to `100`, and the right boundary to `0`.

![screenshot of a tooltip with custom boundaries](./screenshots/tooltip-boundary.png)

<!-- docs: demo code autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<div class="offset-parent">
	<d2l-button id="tooltip-boundary">Tooltip boundary</d2l-button>
	<d2l-tooltip for="tooltip-boundary"
		boundary="{&quot;top&quot;:50, &quot;bottom&quot;:10, &quot;left&quot;:100, &quot;right&quot;:0}">
		This tooltip will not expand beyond its boundaries unless it is impossible to fit it inside
	</d2l-tooltip>
</div>
```
