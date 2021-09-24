# Filter

**NOTE: This component is a work-in-progress and not ready for consumer use yet.**

## d2l-filter

The `d2l-filter` component allows a user to filter on one or more dimensions of data from a single dropdown.

<!-- ![Filter](./screenshots/filter.png?raw=true) -->

```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  // import dimension types you need
</script>

<d2l-filter>
  // Dimensions...
</d2l-filter>
```

**Properties**

| Property | Type | Description |
|--|--|--|
| `disabled` | Boolean, default: `false` | Disables the dropdown opener for the filter |

**Events:**
* `d2l-filter-change`: dispatched when any filter value has changed (may contain info about multiple dimensions and multiple changes in each)
* `d2l-filter-dimension-first-open`: dispatched when a dimension is opened for the first time (if there is only one dimension, this will be dispatched when the dropdown is first opened)
* `d2l-filter-dimension-search`: dispatched when a dimension that supports searching and has the "manual" search-type is searched

**Accessibility**
The filter will announce changes to filter selections, search results, and when filters are being cleared. It is up to the consumer to then announce when these changes have propogated and resulted in new/loaded/updated data on the page. This is very important for screenreader users who are not able to visually see the page changing behind the filter control as selections are made.

## Filter Dimension Types

### d2l-filter-dimension-set and d2l-filter-dimension-set-value

The `d2l-filter-dimension-set` component is the main dimension type that will work for most use cases.  Used alongside the `d2l-filter-dimension-set-value`, this will give you a selectable list of filter values.

```html
<script type="module">
  import '@brightspace-ui/core/components/filter/filter.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set.js';
  import '@brightspace-ui/core/components/filter/filter-dimension-set-value.js';
</script>

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

#### d2l-filter-dimension-set

**Properties**

| Property | Type | Description |
|--|--|--|
| `key` | String, required | Unique identifier for the dimension |
| `loading` | Boolean | Whether the values for this dimension are still loading and a loading spinner should be displayed |
| `search-type` | String, default: `automatic` | `automatic` provides basic case-insensitive text comparison searching, `none` disables the search input, and `manual` fires an event for the consumer to handle the search and pass the keys of the values to be displayed |
| `select-all` | Boolean | Whether to show a select all checkbox and selection summary for this dimension  |
| `selection-single` | Boolean | Whether only one value can be selected at a time for this dimension  |
| `text` | String, required | Text for the dimension in the menu |

#### d2l-filter-dimension-set-value

**Properties**

| Property | Type | Description |
|--|--|--|
| `key` | String, required | Unique identifier within a dimension for the value |
| `text` | String, required | Text for the value in the list |
| `selected` | Boolean, default: `false` | Whether the value in the filter is selected or not |

### d2l-filter-dimension-date

Coming Soon

## Filter Tags

Coming Soon

## Future Enhancements

* ability to delay change events until the user has pressed an apply button (see [#341](https://github.com/BrightspaceUI/core/issues/341))

Looking for an enhancement not listed here? Create a GitHub issue!
