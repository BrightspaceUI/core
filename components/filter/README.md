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

<!-- docs: demo code properties name:d2l-filter align:start autoOpen:true autoSize:false size:large -->
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
* `d2l-filter-dimension-empty-state-action`: dispatched when an empty state action button is clicked
* `d2l-filter-dimension-first-open`: dispatched when a dimension is opened for the first time (if there is only one dimension, this will be dispatched when the dropdown is first opened)
* `d2l-filter-dimension-search`: dispatched when a dimension that supports searching and has the "manual" search-type is searched

<!-- docs: end hidden content -->

## Dimension Set [d2l-filter-dimension-set]

The `d2l-filter-dimension-set` component is the main dimension type that will work for most use cases.  Used alongside the [d2l-filter-dimension-set-value](#d2l-filter-dimension-set-value), this will give you a selectable list of filter values.

<!-- docs: demo code properties name:d2l-filter-dimension-set align:start autoOpen:true autoSize:false size:large -->
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
| `has-more` | Boolean | Whether the dimension has more values to load. Must be used with selected-first and manual search-type. |
| `header-text` | String | A heading displayed above the list items. This is usually unnecessary, but can be used to emphasize or promote something specific about the list of items to help orient users. |
| `introductory-text` | String | The introductory text to display at the top of the filter dropdown |
| `key` | String, required | Unique identifier for the dimension |
| `loading` | Boolean | Whether the values for this dimension are still loading and a loading spinner should be displayed |
| `search-type` | String, default: `automatic` | `automatic` provides basic case-insensitive text comparison searching, `none` disables the search input, and `manual` fires an event for the consumer to handle the search and pass the keys of the values to be displayed |
| `select-all` | Boolean | Whether to show a select all checkbox and selection summary for this dimension  |
| `selected-first` | Boolean | Whether to render the selected items at the top of the filter  |
| `selection-single` | Boolean | Whether only one value can be selected at a time for this dimension  |
| `text` | String, required | Text for the dimension in the menu |
| `value-only-active-filter-text` | Boolean | Whether to hide the dimension in the text sent to active filter subscribers |
<!-- docs: end hidden content -->

## Dimension Set Value [d2l-filter-dimension-set-value]

This component is built to be used alongside the [d2l-filter-dimension-set](#d2l-filter-dimension-set) component. It will give you a selectable list of filter values.

<!-- docs: demo code properties name:d2l-filter-dimension-set-value align:start autoOpen:true autoSize:false size:large -->
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

## Dimension Set Value: Preset Date Range [d2l-filter-dimension-set-date-text-value]

This component is built to be used alongside the [d2l-filter-dimension-set](#d2l-filter-dimension-set) component. It will give you a selectable filter value based on the `range` defined on the component, which is to be one of a set of pre-defined range options. Selection triggers the `d2l-filter-change` event, with `start-value` and `end-value` (in UTC) being included in the changes for the `selected` item.

<!-- docs: demo code properties name:d2l-filter-dimension-set-date-text-value align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-date-text-value.js';
</script>
<d2l-filter>
  <d2l-filter-dimension-set key="dates" text="Dates">
    <d2l-filter-dimension-set-date-text-value key="lastHour" range="lastHour" selected></d2l-filter-dimension-set-date-text-value>
    <d2l-filter-dimension-set-date-text-value key="48hours" range="48hours" disabled></d2l-filter-dimension-set-date-text-value>
    <d2l-filter-dimension-set-date-text-value key="14days" range="14days"></d2l-filter-dimension-set-date-text-value>
  </d2l-filter-dimension-set>
</d2l-filter>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `key` | String, required | Unique identifier within a dimension for the value |
| `range` | String, required | The preset date/time range that the list item represents. Value is to be one of 'today', 'lastHour', '24hours', '48hours', '7days', '14days', '30days', or '6months'. |
| `disabled` | Boolean, default: `false` | Whether the value in the filter is disabled or not |
| `selected` | Boolean, default: `false` | Whether the value in the filter is selected or not |
<!-- docs: end hidden content -->

### Dimension Set Value: Custom Preset Date Range

In order to create a selectable filter list item that is a text item representing a range that is NOT one of the presets available in the `d2l-filter-dimension-set-date-text-value` component (for example, 60 days), use the regular "Dimension Set Value" component (`d2l-filter-dimension-set-value`) with the localized text of the range in the `text` field, and handle its selection as is appropriate for the consuming application.

The `getUTCDateTimeRange(rangeType, diff)` helper function can be used to get the `startValue` and `endValue` for the range in ISO strings in UTC, if required. As arguments it takes a `rangeType` (one of `seconds`, `minutes`, `hours`, `days`, `months`, or `years`) and a `diff` (positive or negative number where negative is a range in the past and positive is a range in the future). Either the `startValue` or `endValue` is the current date/time depending on whether the range is in the past or future.

<!-- docs: demo code align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
  import { getUTCDateTimeRange } from '@brightspace-ui/core/helpers/dateTime.js';

  document.querySelector('d2l-filter').addEventListener('d2l-filter-change', e => {
    const changes = e.detail.dimensions[0].changes;
    if (!changes || changes.length === 0) return;
    let dateTimeRange;
    if (changes[0].valueKey === '60days' && changes[0].selected) {
      dateTimeRange = getUTCDateTimeRange('days', -60);
    } else if (changes[0].valueKey === '8months' && changes[0].selected) {
      dateTimeRange = getUTCDateTimeRange('months', -8);
    }
    if (dateTimeRange) console.log('start date', dateTimeRange.startValue, 'end date', dateTimeRange.endValue);
  });
</script>
<d2l-filter>
  <d2l-filter-dimension-set key="dates" text="Dates" selection-single>
    <d2l-filter-dimension-set-value key="60days" text="60 days"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="8months" text="8 months"></d2l-filter-dimension-set-value>
  </d2l-filter-dimension-set>
</d2l-filter>
```

## Dimension Set Value: Date-Time Range

This component is built to be used alongside the [d2l-filter-dimension-set](#d2l-filter-dimension-set) component. It will give you a selectable filter value based which expands to allow the user to select a date range using either the `d2l-input-date-time-range` or `d2l-input-date-range` component (depending on the `type` of the component). Selection triggers the `d2l-filter-change` event, with `start-value` and `end-value` (in UTC) being included in the changes for the `selected` item.

<!-- docs: demo code properties name:d2l-filter-dimension-set-date-time-range-value align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-date-text-value.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-date-time-range-value.js';
</script>
<d2l-filter>
  <d2l-filter-dimension-set key="dates" text="Dates">
    <d2l-filter-dimension-set-date-text-value key="48hours" range="48hours"></d2l-filter-dimension-set-date-text-value>
    <d2l-filter-dimension-set-date-text-value key="14days" range="14days"></d2l-filter-dimension-set-date-text-value>
    <d2l-filter-dimension-set-date-time-range-value key="custom" selected></d2l-filter-dimension-set-date-time-range-value>
  </d2l-filter-dimension-set>
</d2l-filter>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `key` | String, required | Unique identifier within a dimension for the value |
| `disabled` | Boolean, default: `false` | Whether the value in the filter is disabled or not |
| `end-value` | String | Value of the end date or date-time input. Expected to be in UTC. |
| `selected` | Boolean, default: `false` | Whether the value in the filter is selected or not |
| `start-value` | String | Value of the start date or date-time input. Expected to be in UTC. |
| `text` | String, default: `"Custom Date Range"` (localized) | Text for the value in the list. This would override the default value. |
| `type` | String, default: `"date-time"` | Type of range input. Can be either `date-time` or `date`. |
<!-- docs: end hidden content -->

## Search and Paging

Most filters will not need search or paging features since filter value lists are generally short. For longer lists of filter values when Search is necessary, it can be enabled by setting search-type to `automatic` or `manual`.

`automatic` search runs a basic case-insensitive text comparison on the dimension values that are loaded in the browser, having no awareness of server-side values that are not yet loaded.

`manual` search dispatches a `d2l-filter-dimension-search` event delegating the search to the component's consumer. The event's detail will contain the key of the dimension from where the event was dispatched (`key`), the text value used for the search (`value`) and a callback (`searchCompleteCallback`). This callback gives the consumer control of which keys to display, either by setting `displayAllKeys` to `true` or passing a list of the keys to display as `keysToDisplay` (all other keys will be hidden). The dimension will be in a loading state until the callback is called.
```js
e.detail.searchCompleteCallback({ keysToDisplay: keysToDisplay });
e.detail.searchCompleteCallback({ displayAllKeys: true });
```

As with Search, paging is often unnecessary since filter lists are generally short. For long lists of filter values, load-more paging can be enabled by setting `has-more` on a dimension set, which will display a `d2l-pager-load-more` button at the end of the values. Note however that paging requires the search type to be set to `manual`. Clicking the button replaces its text with a loading spinner and dispatches a `d2l-filter-dimension-load-more` event whose detail, like the search event, contains the dimension key (`key`), active search value (`value`) and a callback (`loadMoreCompleteCallback`) that works just like `searchCompleteCallback` described above. The pager will also be in a loading state until the callback is called.
```js
e.detail.loadMoreCompleteCallback({ keysToDisplay: keysToDisplay });
e.detail.loadMoreCompleteCallback({ displayAllKeys: true });
```

### Selection and manual search/paging

The filter component depends entirely on the consumer to include the selected filter values in order for the selected counts and `d2l-filter-tags` to display the correct values. Ideally, all values should be loaded into the dimensions and the event callbacks should be leveraged to set the visibility on those values. However, in the cases where this is not possible and new values are being added/removed manually from the dimension, then selection should be persisted. This means that selected items should always be loaded and included in the dimension and they should not be removed in order to maintain the functionality of counts and filter tags.
<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/demo/filter-load-more-demo.js'
</script>
<d2l-filter-load-more-demo>
</d2l-filter-load-more-demo>
```

## Counts

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

## Dimension Set Empty State [d2l-filter-dimension-set-empty-state]

The `d2l-filter-dimension-set-empty-state` component allows you to customize the empty state components that are rendered in [d2l-filter-dimension-set](#d2l-filter-dimension-set). When placed in the `d2l-filter-dimension-set` empty state slots, it will replace the component's default empty state. This component can be placed in either the `set-empty-state` or the `search-empty-state` slots.

<!-- docs: demo code properties name:d2l-filter-dimension-set-empty-state align:start autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-empty-state.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';

  document.querySelector('d2l-filter').addEventListener('d2l-filter-dimension-empty-state-action', e => {
      console.log(`Filter dimension empty state action clicked:\nkey: ${e.detail.key}\ntype: ${e.detail.type}`);
    });
</script>
<d2l-filter>
  <d2l-filter-dimension-set key="course" text="Course" >
    <d2l-filter-dimension-set-value key="art" text="Art" count="1" selected></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="astronomy" text="Astronomy" count="3" disabled></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-value key="biology" text="Biology" count="5"></d2l-filter-dimension-set-value>
    <d2l-filter-dimension-set-empty-state slot="search-empty-state" description="Search returned no results." action-text="Add a course"></d2l-filter-dimension-set-empty-state>
    <d2l-filter-dimension-set-empty-state slot="set-empty-state" description="There are no available items." action-text="Add a course"></d2l-filter-dimension-set-empty-state>
  </d2l-filter-dimension-set>
</d2l-filter>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `action-href` | String | The href that will be used for the empty state action. When set with action-text, d2l-filter will render a link action. |
| `action-text` | String | The text that will be displayed in the empty state action. When set, d2l-filter renders a button action, or a link if action-href is also defined. |
| `description` | String, required | The text that is displayed in the empty state description |
<!-- docs: end hidden content -->

## Tags for Applied Filters [d2l-filter-tags]

A tag-list allowing the user to see (and remove) the currently applied filters. Works with the `d2l-filter`. It supports hooking up to multiple filters.

<!-- docs: demo code properties name:d2l-filter-tags align:start display:block autoSize:false size:medium -->
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
<!-- docs: end hidden content -->

## Filter Overflow Group [d2l-filter-overflow-group]

The `d2l-filter-overflow-group` is a container for multiple filters that handles overflow on smaller screens. Overflowing filters are displayed in a single filter.

<!-- docs: demo code properties name:d2l-filter-overflow-group align:start display:block autoSize:false size:medium -->
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
