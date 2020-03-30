# Tooltips
## d2l-tooltip

The `d2l-tooltip` component is used to display additional information when users focus or hover on a point of interest.

![screenshot of an error tooltip](./screenshots/tooltip-error.png)

```html
<script type="module">
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<input type="text" placeholder="Hover for Error" id="tooltip-error">
<d2l-tooltip for="tooltip-error" state="error" align="start" offset="10">
	Your error message will display here
</d2l-tooltip>
```

### Boundaries

Custom boundaries should be used sparingly. If no boundaries are provided, the viewport will be used. However, it might be necessary to constrain a tooltip to improve user experience or to prevent it from being cut off if it has an ancestor with `overflow: hidden;`.

This can be done with the `boundary` attribute that allows any of the tooltip's `"top"`, `"bottom"`, `"left"` and `"right"` to be constrained. Boundaries are defined relative on the tooltip's [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent) so a boundary of `{"top": 0, "bottom": 0, "left": 0, "right": tooltip.offsetParent.width}` will constrain the tooltip so that it opens within its parent element's bounds. Note, `boundary.right` is defined relative to the offset parent's left side.

In the following example the tooltip's orange offset parent has a width of `450px`. To constrain the tooltip to the dashed boundary we can set the top boundary to `50`, the bottom boundary to `10`, the left boundary to `100`, and the right boundary to `450`.

![screenshot of a tooltip with custom boundaries](./screenshots/tooltip-boundary.png)
```html
<script type="module">
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<div class="offset-parent">
	<button id="tooltip-boundary">Tooltip boundary</button>
	<d2l-tooltip for="tooltip-boundary"
		boundary="{&quot;top&quot;:50, &quot;bottom&quot;:10, &quot;left&quot;:100, &quot;right&quot;:450}">
		This tooltip will not expand beyond its boundaries unless it is impossible to fit it inside
	</d2l-tooltip>
</div>
```


**Properties:**
* `for` (required, String): provide the `id` of the tooltip's target element. If this attribute is not provided, the tooltip's parent element will be used as its target.
* `align` (String): optionally align the tooltip with either the start or end of its target. If not set, the dropdown will attempt be centred. Valid values are: `start` and `end`.
* `boundary` (Object) - optionally provide boundaries to where the tooltip will appear. Valid properties are `"top"`, `"bottom"`, `"left"` and `"right"`. The boundary is relative to the tooltip's [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
* **DEPRECATED** `custom-target` (Object) - optionally provide a rectangle that the tooltip should position itself around. The object must provide values for `"left"`, `"top"`, `"width"`, and `"height"`. The custom target is relative to the tooltip's [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent). If a custom target is provided the user is responsible for showing and hiding the tooltip since it no longer has a target element that can be focused or hovered.
* `delay` (Number, default: `0`) - optionally provide a delay that to prevent the tooltip from opening immediately when hovered. This delay will only apply to hover, not focus.
* `disable-focus-lock` (Boolean, default: `false`) - disables focus lock so that the tooltip will automatically close when no longer hovered even if it still has focus.
* `force-show` (Boolean, default: `false`): force the tooltip to stay open as long as it remains `true`
* `offset`: (Number, default: `16.5`): adjust the size of the gap between the tooltip and its target.
* `position` (String): optionally force the tooltip to open in a certain direction. Valid values are: `top`, `bottom`, `left` and `right`. If no position is provided, the tooltip will open in the first position that has enough space for it to open in the order: top, bottom, right, left.
* `showing` (Boolean, default: `false`): a **readonly** only property that can be used to determine if the tooltip is currently visible
* `state` (String, default: `info`): the style of the tooltip based on the type of information it displays. Valid values are: `info` and `error`.

**Events:**
* `d2l-tooltip-show`: dispatched when the tooltip is opened
* `d2l-tooltip-hide`: dispatched when the tooltip is closed

**CSS Variables:**
* **DEPRECATED** Use the `state` property instead of customizing background and border colors to keep tooltips styled consistently across Brightspace. If you find yourself needing a style that isn't supported by the `state` attribute please create a Github issue.
  * `--d2l-tooltip-background-color`: allows the tooltip's background color to be customized
  * `--d2l-tooltip-border-color`: allows the tooltip's border color to be customized
## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
