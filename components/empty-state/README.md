# Empty State
Empty states are used when there is no data available to be displayed, or when a search or filter returns no results.

<!-- docs: demo autoSize:true align:start -->
```html
<script type="module">
  import '@brightspace-ui/core/components/empty-state/empty-state-simple-button.js';
  import '@brightspace-ui/core/components/empty-state/empty-state-illustrated-button.js';
</script>

<d2l-empty-state-simple-button
	description="There are no assignments to display."
	action-text="Create an Assignment">
</d2l-empty-state-simple-button>
<d2l-empty-state-illustrated-button
	illustration-name="desert-road"
	title-text="No Learning Paths Yet"
	description="Get started by clicking below to create your first learning path."
	action-text="Create Learning Paths">
</d2l-empty-state-illustrated-button>

```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Do make it clear that there is no data available to be displayed
* Do include guidance on next steps if available, either as short instructions or as Call to Actions
* Do use a link for navigation and a button for actions
* Do replace the entire content with its empty state for accessibility
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use an empty state as a default state while data is loading
* Don't leave a section completely empty, or use a skeleton loading screen in place of an empty state component
* Avoid causing users to believe that they have hit a dead-end when they have not
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Empty State Simple Button [d2l-empty-state-simple-button]

The `d2l-empty-state-simple-button` component is an empty state component that displays a description and action button.

<!-- docs: demo live name:d2l-empty-state-simple-button -->
```html
<script type="module">
  import '@brightspace-ui/core/components/empty-state/empty-state-simple-button.js';
</script>

<d2l-empty-state-simple-button
	description="There are no assignments to display."
	action-text="Create an Assignment">
</d2l-empty-state-simple-button>
```

## Empty State Simple Link [d2l-empty-state-simple-link]

The `d2l-empty-state-simple-link` component is an empty state component that displays a description and action link.

<!-- docs: demo live name:d2l-empty-state-simple-link -->
```html
<script type="module">
  import '@brightspace-ui/core/components/empty-state/empty-state-simple-link.js';
</script>

<d2l-empty-state-simple-link
	description="There are no assignments to display."
	action-text="Create an Assignment"
	action-href='https://d2l.com'>
</d2l-empty-state-simple-link>
```
## Empty State Illustrated Button [d2l-empty-state-illustrated-button]

The `d2l-empty-state-illustrated-button` component is an empty state component that displays a title and description with an illustration and action button. The `illustration-name` property can be set to use one of the preset illustrations or a custom SVG illustration can be added in the default slot.

<!-- docs: demo live name:d2l-empty-state-illustrated-button -->
```html
<script type="module">
  import '@brightspace-ui/core/components/empty-state/empty-state-illustrated-button.js';
</script>

<d2l-empty-state-illustrated-button 
	illustration-name="desert-road"
	title-text="No Learning Paths Yet"
	description="Get started by clicking below to create your first learning path."
	action-text="Create Learning Paths">
</d2l-empty-state-illustrated-button>
```

## Empty State Illustrated Link [d2l-empty-state-illustrated-link]

The `d2l-empty-state-illustrated-link` component is an empty state component that displays a title and description with an illustration and action link. The `illustration-name` property can be set to use one of the preset illustrations or a custom SVG illustration can be added in the default slot.

<!-- docs: demo live name:d2l-empty-state-illustrated-link -->
```html
<script type="module">
  import '@brightspace-ui/core/components/empty-state/empty-state-illustrated-link.js';
</script>

<d2l-empty-state-illustrated-link
	illustration-name="desert-road"
	title-text="No Learning Paths Yet"
	description="Get started by clicking below to create your first learning path."
	action-text="Create Learning Paths"
	action-href='https://d2l.com'>
</d2l-empty-state-illustrated-link>
```

## Preset Empty State Illustrations

| Illustration | Name |
| :---: | :--- |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/assembly-line.svg?sanitize=true) | assembly-line |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/blueprint.svg?sanitize=true) | blueprint |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/calendar.svg?sanitize=true) | calendar |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/cat-computer.svg?sanitize=true) | cat-computer |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/checklist.svg?sanitize=true) | checklist |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/data-tracking.svg?sanitize=true) | data-tracking |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/desert-road.svg?sanitize=true) | desert-road |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/fish-hook.svg?sanitize=true) | fish-hook |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/oven.svg?sanitize=true) | oven |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/pipeline.svg?sanitize=true) | pipeline |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/race.svg?sanitize=true) | race |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/rockets.svg?sanitize=true) | rockets |
| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/tumbleweed.svg?sanitize=true) | tumbleweed |
