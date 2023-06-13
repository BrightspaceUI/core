# Tooltips

Tooltips display additional information when users focus or hover on a point of interest.

<!-- docs: demo autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
  import '@brightspace-ui/core/components/tooltip/tooltip-help.js';

  window.addEventListener('load', function () {
    setTimeout(function() {
      const tooltip = document.querySelector('#tooltip');
      const helpTooltip = document.querySelector('#help-tooltip');

      tooltip.showing = true;
      helpTooltip.showing = true;
    }, 20);
  });
</script>

<d2l-button id="tooltip-button">Hover here</d2l-button>
<d2l-tooltip id="tooltip" for="tooltip-button">
  Tooltip message example
</d2l-tooltip>

<d2l-tooltip-help id="help-tooltip" text="Hover here">
  Tooltip message example
</d2l-tooltip-help>
```

Note: there is a [known defect](https://rally1.rallydev.com/#/?detail=/defect/641656338755&fdp=true) for tooltips, where they are sometimes rendered offset by some amount unexpectedly.

## Accessibility

**Interactive Target Elements:**

If the tooltip's target is an interactive element then it will automatically be accessible. [A list of interactive elements can be found here.](https://github.com/BrightspaceUI/core/blob/main/components/tooltip/tooltip.js#L38)

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

### Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to show error messages during form validation
* Use to give the name or purpose of an icon button
* Use to provide the “full text” for a truncated value in a tight datagrid or list
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use tooltips for long paragraphs of text
* Don’t use tooltips to repeat text that is already shown
* Don’t allow a tooltip to cover something important (the “hover and cover” anti-pattern)
<!-- docs: end donts -->
<!-- docs: end best practices -->

<!-- docs: demo code properties name:d2l-tooltip autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>
<!-- docs: start hidden content --> 
<script>
  window.addEventListener('load', function () {
    setTimeout(function() {
      const tooltip = document.querySelector('d2l-tooltip');
      tooltip.showing = true;
    }, 20);
  });
</script>
<!-- docs: end hidden content -->
<d2l-input-text placeholder="Hover for Error" id="tooltip-error" aria-invalid="true" label="Text Input" label-hidden style="max-width:250px;"></d2l-input-text>
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
| `show-truncated-only` | Boolean, default: `false` | Only show the tooltip if we detect the target element is truncated |
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

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>
<!-- docs: start hidden content --> 
<script>
  window.addEventListener('load', function () {
    setTimeout(function() {
      const tooltip = document.querySelector('d2l-tooltip');
      tooltip.showing = true;
    }, 20);
  });
</script>
<!-- docs: end hidden content -->
<style>
  .boundary {
    border: 1px dashed #cdd5dc;
    border-radius: 6px;
    box-sizing: border-box;
    display: inline-block;
    height: 175px;
    padding-left: 150px;
    padding-top: 60px;
    position: relative;
    width: 350px;
  }
</style>

<div class="offset-parent boundary">
  <d2l-button id="tooltip-boundary">Tooltip boundary</d2l-button>
  <d2l-tooltip for="tooltip-boundary"
    boundary="{&quot;top&quot;:0, &quot;bottom&quot;:0, &quot;left&quot;:0, &quot;right&quot;:0}">
    This tooltip will not expand beyond its boundaries unless it is impossible to fit it inside
  </d2l-tooltip>
</div>
```

## Help Tooltip [d2l-tooltip-help]

The `d2l-tooltip-help` component is used to display additional information when users focus or hover over some text.

### Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use a help tooltip when there are space limitations, such as in a table, list, or narrow sidebar
* Use a helpful label that provides value on its own; the tooltip should elaborate on the label
* Keep help text short and concise, full sentences are not necessary
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use help tooltips when you're able to use inline help text instead
* Avoid overusing help tooltips since even expert users will feel obligated to check their contents
<!-- docs: end donts -->
<!-- docs: end best practices -->

<!-- docs: demo code properties name:d2l-tooltip-help autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tooltip/tooltip-help.js';
</script>
<!-- docs: start hidden content --> 
<script>
  window.addEventListener('load', function () {
    setTimeout(function() {
      const tooltip = document.querySelector('d2l-tooltip-help');
      tooltip.showing = true;
    }, 20);
  });
</script>
<!-- docs: end hidden content -->
<p class="d2l-body-compact">
  This is some sample text.
  <d2l-tooltip-help text="Helpful label">Contents should elaborate on the label (be short and concise)</d2l-tooltip-help>
</p>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text for the Help Tooltip opener |
| `inherit-font-style` | Boolean, default: `false` | Allows the opener text to inherit font properties such as size and color |
| `position` | String | Optionally force the tooltip to open in a certain direction. Valid values are: `top`, `bottom`, `left` and `right`. If no position is provided, the tooltip will open in the first position that has enough space for it in the order: bottom, top, right, left. |

<!-- docs: end hidden content -->

### Using in a Sentence or Paragraph

When placing a help tooltip next to other text as part of a sentence or a paragraph, use `inherit-font-style` to align its style with the adjacent text 
(see the demo example above).

Note that the help tooltip does not support being used *within* a language term, due to challenges with translation.   
Instead, your opener text will need to be a separate language term appearing before or after the other text and making sense on its own. 

See also the [Visibility Switch](https://daylight.d2l.dev/components/switch/#d2l-switch-visibility) for an example use case.
