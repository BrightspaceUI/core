# Filtering

Filter components are often used in conjuction with [tables](../components/table) or [lists](../components/list) and allow users to select a subset of the presented data based on a set of parameters. 

<!-- docs: demo autoSize:false align:start size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
<!-- docs: start hidden content -->
<script>
  window.addEventListener('load', function () {
    var demoElem = document.querySelector('#demo-element');
    if (!demoElem.hasAttribute('data-first-load')) return;
    setTimeout(() => {
    }, 100);
  });
</script>
<!-- docs: end hidden content -->
<d2l-filter>
	<d2l-filter-dimension-set key="course" text="Course">
		<d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
	</d2l-filter-dimension-set>
	<d2l-filter-dimension-set key="role" text="Role">
		<d2l-filter-dimension-set-value key="admin" text="Admin"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="instructor" text="Instructor"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="student" text="Student"></d2l-filter-dimension-set-value>
	</d2l-filter-dimension-set>
	<d2l-filter-dimension-set key="semester" text="Semester" selection-single>
		<d2l-filter-dimension-set-value key="fall" text="Fall"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="winter" text="Winter" selected></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="spring" text="Spring"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="summer" text="Summer"></d2l-filter-dimension-set-value>
	</d2l-filter-dimension-set>
</d2l-filter>
```

## Filter [d2l-filter]

The `d2l-filter` component allows a user to filter on one or more dimensions of data from a single dropdown.

<!-- docs: start hidden content -->
<!-- ![Filter](./screenshots/filter.png?raw=true) -->
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-filter autoSize:false align:start size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
<!-- docs: start hidden content -->
<script>
  window.addEventListener('load', function () {
    var demoElem = document.querySelector('#demo-element');
    if (!demoElem.hasAttribute('data-first-load')) return;
    setTimeout(() => {
		var filter = document.querySelector('d2l-filter');
		filter.opened = true;
    }, 100);
  });
</script>
<!-- docs: end hidden content -->
<d2l-filter>
	<d2l-filter-dimension-set key="course" text="Course">
		<d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="drama" text="Drama"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="english" text="English"></d2l-filter-dimension-set-value>
	</d2l-filter-dimension-set>
	<d2l-filter-dimension-set key="role" text="Role">
		<d2l-filter-dimension-set-value key="admin" text="Admin"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="instructor" text="Instructor"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="student" text="Student"></d2l-filter-dimension-set-value>
	</d2l-filter-dimension-set>
	<d2l-filter-dimension-set key="semester" text="Semester" selection-single>
		<d2l-filter-dimension-set-value key="fall" text="Fall"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="winter" text="Winter" selected></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="spring" text="Spring"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="summer" text="Summer"></d2l-filter-dimension-set-value>
	</d2l-filter-dimension-set>
</d2l-filter>
``` 

### Single Vs Multi Dimensional 
A filter can be a single dimension (like picking from a list of departments) or offer multiple dimensions (filter by role, or department, or something else). Single-dimension filters can be used side-by-side to promite filters that are more commonly used. while tucking less-used filters into a multi-dimensional filter
<!-- docs: demo code name:d2l-filter autoSize:false align:start size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
<!-- docs: start hidden content -->
<script>
  window.addEventListener('load', function () {
    var demoElem = document.querySelector('#demo-element');
    if (!demoElem.hasAttribute('data-first-load')) return;
    setTimeout(() => {
		var filter = document.querySelector('d2l-filter');
		filter.opened = true;
    }, 100);
  });
</script>
<style>
	.flex-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
<!-- docs: end hidden content -->
<div class="flex-div">
	Single Dimension
	<d2l-filter>
		<d2l-filter-dimension-set key="course" text="Course">
			<d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>
</div>
<div class="flex-div">
	Multi-Dimensional
	<d2l-filter>
		<d2l-filter-dimension-set key="course" text="Course">
			<d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="semester" text="Semester" selection-single>
			<d2l-filter-dimension-set-value key="fall" text="Fall"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="winter" text="Winter" selected></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="spring" text="Spring"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="summer" text="Summer"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>
</div>
``` 

### Accessibility
The filter will announce changes to filter selections, search results, and when filters are being cleared. It is up to the consumer to then announce when these changes have propogated and resulted in new/loaded/updated data on the page. This is very important for screenreader users who are not able to visually see the page changing behind the filter control as selections are made.

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `disabled` | Boolean, default: `false` | Disables the dropdown opener for the filter |

### Events
* `d2l-filter-change`: dispatched when any filter value has changed (may contain info about multiple dimensions and multiple changes in each)
* `d2l-filter-dimension-first-open`: dispatched when a dimension is opened for the first time (if there is only one dimension, this will be dispatched when the dropdown is first opened)
* `d2l-filter-dimension-search`: dispatched when a dimension that supports searching and has the "manual" search-type is searched

<!-- docs: end hidden content -->

## Filter Dimension Types [d2l-filter-dimension-set] 

The `d2l-filter-dimension-set` component is the main dimension type that will work for most use cases.  Used alongside the `d2l-filter-dimension-set-value`, this will give you a selectable list of filter values.

<!-- docs: demo live name:d2l-filter-dimension-set align:start autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
<!-- docs: start hidden content -->
<script>
  window.addEventListener('load', function () {
    var demoElem = document.querySelector('#demo-element');
    if (!demoElem.hasAttribute('data-first-load')) return;
    setTimeout(() => {
		var filter = document.querySelector('d2l-filter');
		filter.opened = true;
    }, 100);
  });
</script>
<!-- docs: end hidden content --> 
<d2l-filter>
  <d2l-filter-dimension-set key="course" text="Course" >
    <d2l-filter-dimension-set-value key="art" text="Art" selected><d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="biology" text="Biology"><d2l-filter-dimension-set-value>
  </d2l-filter-dimension-set>
  <d2l-filter-dimension-set key="role" text="Role" >
    <d2l-filter-dimension-set-value key="admin" text="Admin" selected><d2l-filter-dimension-set-value>
  </d2l-filter-dimension-set>
</d2l-filter>
```

<!-- docs: start hidden content -->
#### d2l-filter-dimension-set

### Properties

| Property | Type | Description |
|---|---|---|
| `key` | String, required | Unique identifier for the dimension |
| `loading` | Boolean | Whether the values for this dimension are still loading and a loading spinner should be displayed |
| `search-type` | String, default: `automatic` | `automatic` provides basic case-insensitive text comparison searching, `none` disables the search input, and `manual` fires an event for the consumer to handle the search and pass the keys of the values to be displayed |
| `select-all` | Boolean | Whether to show a select all checkbox and selection summary for this dimension  |
| `selection-single` | Boolean | Whether only one value can be selected at a time for this dimension  |
| `text` | String, required | Text for the dimension in the menu |

#### d2l-filter-dimension-set-value

### Properties

| Property | Type | Description |
|---|---|---|
| `key` | String, required | Unique identifier within a dimension for the value |
| `text` | String, required | Text for the value in the list |
| `selected` | Boolean, default: `false` | Whether the value in the filter is selected or not |
<!-- docs: end hidden content -->

## Filter dimension: Date [d2l-filter-dimension-date]

**Coming Soon!**

## Filter dimension: Tags [d2l-filter-dimension-tags]

**Coming Soon!**

<!-- docs: start hidden content -->
## Future Enhancements

* ability to delay change events until the user has pressed an apply button (see [#341](https://github.com/BrightspaceUI/core/issues/341))

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
