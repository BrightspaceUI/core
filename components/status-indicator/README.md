# Status Indicators
Status Indicators are used to communicate the status of an item. They are non-interactive and assert prominence on state.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>
<style>
  .status-format {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    width: 30rem;
    margin: 0px auto;
  }
  d2l-status-indicator {
    margin: .6rem;
    display: block;
  }
</style>

<div class="status-format d2l-typography">
  <div>
    <d2l-status-indicator state="default" text="due today"></d2l-status-indicator>
    <d2l-status-indicator state="default" text="due today" bold></d2l-status-indicator>
  </div>
  <div>
    <d2l-status-indicator state="success" text="complete"></d2l-status-indicator>
    <d2l-status-indicator state="success" text="complete" bold></d2l-status-indicator>
  </div>
  <div>
    <d2l-status-indicator state="alert" text="overdue"></d2l-status-indicator>
    <d2l-status-indicator state="alert" text="overdue" bold></d2l-status-indicator>
  </div>
  <div>
    <d2l-status-indicator state="none" text="closed"></d2l-status-indicator>
    <d2l-status-indicator state="none" text="closed" bold></d2l-status-indicator>
  </div>
</div>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Only use when status is critical to the users’ workflow
* Maintain consistent placement when used in a list
* Limit text values to one word; 2 max
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't render as a link; if the user requires a call to action, use a button
* Don't compose the element such that the user will think that the indicator is interactive
* Avoid using verbs
* Don't include additional text in the status badge
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Status Indicator [d2l-status-indicator]

<!-- docs: demo code properties name:d2l-status-indicator sandboxTitle:'Status Indicator' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-status-indicator state="default" text="Due Today"></d2l-status-indicator>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | The text that is displayed within the status indicator |
| `bold` | Boolean | Use when the status is very important and needs to have a lot of prominence |
| `state` | String, default: `default` | State of status indicator to display. Can be one of  `default`, `success`, `alert` , `none` |
<!-- docs: end hidden content -->

### Bold

Use the bold style if the state is central to the user's task and should have maximum prominence. Use the default style if the state is important but not critical to the user's workflow. It is acceptable to mix the styles if one particular state should stand out more than the rest.

<!-- docs: demo code properties -->
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>
<d2l-status-indicator state="alert" text="overdue" bold></d2l-status-indicator>
```

### States

The state is used to apply a meaningful colour to the status indicator to assist with scannability. The visible label should still have a clear meaning so that users who can't see the colour can still understand the state.

* **Default** - the state is important but not urgent 
* **Success** - the state is considered positive or complete
* **Alert** - the state requires urgent attention
* **None** - the state is not important

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>
<style>
  .status-format {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    width: 30rem;
    margin: 0px auto;
  }
  d2l-status-indicator {
    margin: .6rem;
    display: block;
  }
  .status-format p {
    margin-top: 0px;
  }
</style>

<div class="status-format d2l-typography">
  <div>
    <p class="d2l-label-text">Default</p>
    <d2l-status-indicator state="default" text="due today"></d2l-status-indicator>
    <d2l-status-indicator state="default" text="due today" bold></d2l-status-indicator>
  </div>
  <div>
    <p class="d2l-label-text">Success</p>
    <d2l-status-indicator state="success" text="complete"></d2l-status-indicator>
    <d2l-status-indicator state="success" text="complete" bold></d2l-status-indicator>
  </div>
  <div>
    <p class="d2l-label-text">Alert</p>
    <d2l-status-indicator state="alert" text="overdue"></d2l-status-indicator>
    <d2l-status-indicator state="alert" text="overdue" bold></d2l-status-indicator>
  </div>
  <div>
    <p class="d2l-label-text">None</p>
    <d2l-status-indicator state="none" text="closed"></d2l-status-indicator>
    <d2l-status-indicator state="none" text="closed" bold></d2l-status-indicator>
  </div>
</div>

```

### Content

The text label should be kept short; one or two words at most. If more information is needed to explain the state or give extra context, the information should be included after the label and should use the same color to associate the information with the state. When placing additional text on the same line as the status indicator, ensure that the bottom of the text is even across all elements.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
  import '@brightspace-ui/core/components/icons/icon.js';
</script>
<style>
	.align-item {
		color: var(--d2l-color-tungsten);
		font-size: 0.7rem;
	}
	.align-item.bullet::before {
		color: var(--d2l-color-tungsten);
		content: '\002022';
		margin-left: 6px;
		margin-right: 6px;
	}
	.card {
		min-width: 300px
	}
	.icon {
		width: 60px;
	}
	.row {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 100%;
	}
	.column {
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		flex: 1;
	}
	.indicator {
		margin-bottom: 12px;
		min-width: 350px;
	}
	d2l-icon {
		margin-right: 15px;
		height: 45px;
		min-width: 45px;
	}
	.text {
		font-size: 16px;
		line-height: 18px;
	}
</style>
<div class="row">

	<d2l-icon icon="tier3:assignments">
	</d2l-icon>

	<div class="column">
		<h4 style="margin: 0;">
			Hurricanes - what, where, why
		</h4>
		<div class="indicator">
			<d2l-status-indicator state="alert" text="overdue" bold></d2l-status-indicator>
      <span class="align-item" style="margin-left: 6px; color: var(--d2l-color-cinnabar);">Ends Tomorrow</span>
			<span class="align-item bullet">Grade 6 Science</span>
			<span class="align-item bullet">Assignment</span>
		</div>
		<div class="d2l-typography text">
			Provide a detailed description of the information that you received in our lesson on how hurricanes are formed and where they are most likely to occur.
		</div>
	</div>

</div>
```
