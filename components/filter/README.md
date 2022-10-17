# Filtering

Filter components are often used in conjuction with [tables](../../components/table) and allow users to select a subset of the presented data based on a set of parameters. Filter dimensions provide methods for entering parameters for a wide range of data types.

<!-- docs: demo align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
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

<!-- docs: demo live name:d2l-filter align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
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
A filter can be a single dimension (like picking from a list of courses) or offer multiple dimensions (filter by role, or department, or something else). Single-dimension filters can be used side-by-side to promote filters that are more commonly used, while tucking less-used filters into a multi-dimensional filter.

<!-- docs: demo code align:start autoSize:false size:large -->
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
        <d2l-filter-dimension-set key="role" text="Role">
            <d2l-filter-dimension-set-value key="admin" text="Admin"></d2l-filter-dimension-set-value>
            <d2l-filter-dimension-set-value key="student" text="Student" selected></d2l-filter-dimension-set-value>
            <d2l-filter-dimension-set-value key="teacher" text="Teacher"></d2l-filter-dimension-set-value>
        </d2l-filter-dimension-set>
        <d2l-filter-dimension-set key="department" text="Department" selection-single>
            <d2l-filter-dimension-set-value key="english" text="English"></d2l-filter-dimension-set-value>
            <d2l-filter-dimension-set-value key="history" text="History" selected></d2l-filter-dimension-set-value>
            <d2l-filter-dimension-set-value key="math" text="Math" selected></d2l-filter-dimension-set-value>
            <d2l-filter-dimension-set-value key="science" text="Science"></d2l-filter-dimension-set-value>
        </d2l-filter-dimension-set>
    </d2l-filter>
</div>
```

### Iterating Over Dimensions and Values

Lit tries to reuse DOM nodes when it can to help with performance, but in this case we don't want unique dimensions and values to be reused - otherwise we can't detect additions/removals properly.

If you are going to be constructing your dimensions and/or dimension values by iterating over an array or object (using `forEach,` , `map`, etc.), you'll want to use the [Lit `repeat` directive with a `KeyFn` set](https://lit.dev/docs/templates/directives/#repeat) instead to tell Lit not to reuse a DOM node if the `key` has changed:
```js
import { repeat } from 'lit/directives/repeat.js';
...
return html`<d2l-filter>
  ${repeat(this._dimensions, (dim) => dim.key, dim => html`
    <d2l-filter-dimension-set key="${dim.key}" text=${dim.text}>
      ${repeat(dim._values, (value) => value.key, value => html`
        <d2l-filter-dimension-set-value key="${value.kay}" text="${value.text}" ?selected="${value.selected}"></d2l-filter-dimension-set-value>
      `)}
    </d2l-filter-dimension-set>
  `)}
</d2l-filter>`;
```

### Accessibility
The filter will announce changes to filter selections, search results, and when filters are being cleared. It is up to the consumer to then announce when these changes have propagated and resulted in new/loaded/updated data on the page. This is very important for screenreader users who are not able to visually see the page changing behind the filter control as selections are made.

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `disabled` | Boolean, default: `false` | Disables the dropdown opener for the filter |
| `opened` | Boolean, default: `false` | Whether or not the filter is open |
| `text` | String | Optional override for the button text used for a multi-dimensional filter |

### Events
* `d2l-filter-change`: dispatched when any filter value has changed (may contain info about multiple dimensions and multiple changes in each)
* `d2l-filter-dimension-first-open`: dispatched when a dimension is opened for the first time (if there is only one dimension, this will be dispatched when the dropdown is first opened)
* `d2l-filter-dimension-search`: dispatched when a dimension that supports searching and has the "manual" search-type is searched

<!-- docs: end hidden content -->

## Dimension Set [d2l-filter-dimension-set]

The `d2l-filter-dimension-set` component is the main dimension type that will work for most use cases.  Used alongside the [d2l-filter-dimension-set-value](#d2l-filter-dimension-set-value), this will give you a selectable list of filter values.

<!-- docs: demo live name:d2l-filter-dimension-set align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
<d2l-filter>
  <d2l-filter-dimension-set key="course" text="Course" >
    <d2l-filter-dimension-set-value key="art" text="Art" selected></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
  </d2l-filter-dimension-set>
  <d2l-filter-dimension-set key="role" text="Role" >
    <d2l-filter-dimension-set-value key="admin" text="Admin" selected></d2l-filter-dimension-set-value>
  </d2l-filter-dimension-set>
</d2l-filter>
```

<!-- docs: start hidden content -->
### d2l-filter-dimension-set

### Properties

| Property | Type | Description |
|---|---|---|
| `key` | String, required | Unique identifier for the dimension |
| `loading` | Boolean | Whether the values for this dimension are still loading and a loading spinner should be displayed |
| `search-type` | String, default: `automatic` | `automatic` provides basic case-insensitive text comparison searching, `none` disables the search input, and `manual` fires an event for the consumer to handle the search and pass the keys of the values to be displayed |
| `select-all` | Boolean | Whether to show a select all checkbox and selection summary for this dimension  |
| `selection-single` | Boolean | Whether only one value can be selected at a time for this dimension  |
| `text` | String, required | Text for the dimension in the menu |
| `value-only-active-filter-text` | Boolean | Whether to hide the dimension in the text sent to active filter subscribers |
<!-- docs: end hidden content -->

## Dimension Set Value [d2l-filter-dimension-set-value]

This component is built to be used alongside the [d2l-filter-dimension-set](#d2l-filter-dimension-set) component, this will give you a selectable list of filter values.

<!-- docs: demo live name:d2l-filter-dimension-set-value align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
<d2l-filter>
  <d2l-filter-dimension-set key="course" text="Course" >
    <d2l-filter-dimension-set-value key="art" text="Art" count="1" selected></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="astronomy" text="Astronomy" count="3" disabled></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="biology" text="Biology" count="5"></d2l-filter-dimension-set-value>
  </d2l-filter-dimension-set>
</d2l-filter>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `count` | Number | Count for the value in the list. If no count is provided, no count will be displayed |
| `disabled` | Boolean, default: `false` | Whether the value in the filter is disabled or not |
| `key` | String, required | Unique identifier within a dimension for the value |
| `text` | String, required | Text for the value in the list |
| `selected` | Boolean, default: `false` | Whether the value in the filter is selected or not |
<!-- docs: end hidden content -->

## Counts [d2l-filter-dimension-set-value]

The `count` property displays a count next to each filter value to indicate the number of results a value will yield. This helps users more effectively explore data and make selections, so it’s a good idea to provide these counts if it can be done performantly.

Note that when using multiple filter dimensions, the counts should be updated when selections are made across dimensions so that they always reflect the number of results a filter will yield.

<!-- docs: demo code align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>
<d2l-filter>
  <d2l-filter-dimension-set key="course" text="Course" >
    <d2l-filter-dimension-set-value key="art" text="Art" count="0"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="astronomy" text="Astronomy" count="1" selected></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="biology" text="Biology" count="1024"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="chemistry" text="Chemistry" count="25" disabled></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="drama" text="Drama" count="362"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="english" text="English" count="881"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="how-to" text="How To Write a How To Article With a Flashy Title" count="212"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="math" text="Math" count="22365"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="physics" text="Physics" count="27"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="stats" text="Statistics" count="2"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="writerscraft" text="Writer's Craft" count="96"></d2l-filter-dimension-set-value>
  </d2l-filter-dimension-set>
</d2l-filter>
```

## Tags for Applied Filters [d2l-filter-tags]

A tag-list allowing the user to see (and remove) the currently applied filters. Works with the `d2l-filter`. It supports hooking up to multiple filters.

<!-- docs: demo live name:d2l-filter-tags align:start display:block autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
  import '@brightspace-ui/core/components/filter/filter-tags.js';
</script>
<style>
  .filter-wrapper {
    display: flex;
    justify-content: space-between;
  }
  d2l-filter-tags {
    align-self: center;
    position: relative;
    width: 100%;
  }

  @media(max-width: 600px) {
      .filter-wrapper {
        display: block;
        max-width: 100%;
      }
  }
</style>
<div class="filter-wrapper">
  <d2l-filter-tags filter-ids="core-filter core-filter-2"></d2l-filter-tags>

  <d2l-filter id="core-filter">
    <d2l-filter-dimension-set key="1" text="Dim 1">
      <d2l-filter-dimension-set-value selected text="Option 1 - 1" key="1" ></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 1 - 2" key="2"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 1 - 3" key="3"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 1 - 4" key="4"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
    <d2l-filter-dimension-set key="2" text="Dim 2">
      <d2l-filter-dimension-set-value selected text="Option 2 - 1" key="1"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 2 - 2" key="2"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 2 - 3" key="3"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>

  <d2l-filter id="core-filter-2">
    <d2l-filter-dimension-set key="1" text="Dim 1" value-only-active-filter-text>
      <d2l-filter-dimension-set-value selected text="Option 1 - 1" key="1" ></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 1 - 2" key="2"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 1 - 3" key="3"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 1 - 4" key="4"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
    <d2l-filter-dimension-set key="2" text="Dim 2" value-only-active-filter-text>
      <d2l-filter-dimension-set-value selected text="Option 2 - 1" key="1"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 2 - 2" key="2"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value text="Option 2 - 3" key="3"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>
</div>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `filter-ids` | String, required | Id(s) (space-delimited) of the filter component(s) to subscribe to |
| `label` | String | The text displayed in this component's label |
<!-- docs: end hidden content -->

## Filter Overflow Group [d2l-filter-overflow-group]

The `d2l-filter-overflow-group` is a container for multiple filters that handles overflow on smaller screens. Overflowing filters are displayed in a single filter.

<!-- docs: demo live name:d2l-filter-overflow-group align:start display:block autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
  import '@brightspace-ui/core/components/filter/filter-overflow-group.js';
</script>
<d2l-filter-overflow-group>
  <d2l-filter>
    <d2l-filter-dimension-set key="skill" text="Skill">
      <d2l-filter-dimension-set-value key="communication" text="Fall"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="leadership" text="Winter"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="management" text="Spring"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="planning" text="Summer"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>
  <d2l-filter>
    <d2l-filter-dimension-set key="type" text="Type" selection-single>
      <d2l-filter-dimension-set-value key="certificate" text="Certificate"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="degree" text="Degree"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="diploma" text="Diploma"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="course" text="Course"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>
  <d2l-filter>
    <d2l-filter-dimension-set key="course" text="Course" select-all>
      <d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
    <d2l-filter-dimension-set key="duration" text="Duration">
      <d2l-filter-dimension-set-value key="lessthanthree" text="< 3 months"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="threetosix" text="3-6 months"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="sixtotwelve" text="6-12 months"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>
  <d2l-filter>
    <d2l-filter-dimension-set key="provider" text="Semester3">
      <d2l-filter-dimension-set-value key="mcmaster" text="McMaster"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="powered" text="PowerED"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="guelph" text="University of Guelph"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="manitoba" text="University of Manitoba"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>
  <d2l-filter>
    <d2l-filter-dimension-set key="format" text="Format">
      <d2l-filter-dimension-set-value key="selfpaced" text="Self-Paced"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="instructor" text="Instructor Lead" selected></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>
  <d2l-filter>
    <d2l-filter-dimension-set key="language" text="Language" selection-single>
      <d2l-filter-dimension-set-value key="english" text="English"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="french" text="French"></d2l-filter-dimension-set-value>
      <d2l-filter-dimension-set-value key="spanish" text="Spanish"></d2l-filter-dimension-set-value>
    </d2l-filter-dimension-set>
  </d2l-filter>
</d2l-filter-overflow-group>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `min-to-show` | Number | The minimum number of elements to always show. Please consult the design team when using this attribute. |
| `max-to-show` | Number | The maximum number of elements to show |
| `tags` | Boolean, default: `false` | Show `d2l-filter-tags` beneath the filters. Tags will be shown for all filters in the group. |
<!-- docs: end hidden content -->

<!-- docs: start hidden content -->
## Future Improvements

* Date Dimension - Ability to filter by dates
* ability to delay change events until the user has pressed an apply button (see [#341](https://github.com/BrightspaceUI/core/issues/341))

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
