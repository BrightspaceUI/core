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

**Properties:**

| Property | Type | Description |
|--|--|--|
| `disabled` | Boolean, default: `false` | Disables the dropdown opener for the filter |

**Events:**
* `d2l-filter-change`: dispatched when any filter value has changed (may contain info about multiple changes)
* `d2l-filter-dimension-open`: dispatched when a dimension is opened (if there is only one dimension, this will be dispatched when the dropdown is opened)

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

**Properties:**

| Property | Type | Description |
|--|--|--|
| `key` | String, required | Unique identifier for the dimension |
| `loading` | Boolean | Whether the values for this dimension are still loading and a loading spinner should be displayed |
| `text` | String, required | Text for the dimension in the menu |

#### d2l-filter-dimension-set-value

**Properties:**

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
