# Sorting

The sort menu allows the user to adjust the sort order of data in a list.

<!-- docs: demo align:flex-start autoOpen:true autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/sorting/sort.js';
  import '@brightspace-ui/core/components/sorting/sort-item.js';
</script>
<d2l-sort>
	<d2l-sort-item text="Most Relevant" selected></d2l-sort-item>
	<d2l-sort-item text="Recently Updated"></d2l-sort-item>
	<d2l-sort-item text="Highest Rated"></d2l-sort-item>
</d2l-sort>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Make the Sort the right-most component in a group of Search, Filters & Sort controls
* Carefully consider the user’s workflow before adding a reversible order to the sort. Most sort options do not need to be reversible.
* Write Sort option labels in Title Case
* Make Sort labels specific rather than general — “Sort: Course Title” is better than “Sort: Alphabetical”.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t include an excessive number of sorting options — every additional option increases the cognitive load on the user when making a decision
* Don’t make phrasings too similar — the first word of the option should be unique (“Last Accessed”, “Enrolment Date”, “Date Pinned”)
* Don’t use when sorting table data. If the data is presented with table column headers, use [Sortable Column Buttons](../table#d2l-table-col-sort-button) to apply sorting.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Sort [d2l-sort]

The `<d2l-sort>` element is a required wrapper around multiple `<d2l-sort-item>` elements.

<!-- docs: demo code properties name:d2l-sort sandboxTitle:'Sort' align:flex-start autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/sorting/sort.js';
  import '@brightspace-ui/core/components/sorting/sort-item.js';
</script>
<d2l-sort>
	<d2l-sort-item text="Most Relevant" value="relevant" selected></d2l-sort-item>
	<d2l-sort-item text="Recently Updated" value="updated"></d2l-sort-item>
	<d2l-sort-item text="Highest Rated" value="rating"></d2l-sort-item>
</d2l-sort>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `disabled` | Boolean | Disables the sort |

### Events

- `d2l-sort-change`: dispatched when the selected sort item changes
<!-- docs: end hidden content -->

## Sort Item [d2l-sort-item]

The `<d2l-sort-item>` element represents an option within its parent `<d2l-sort>`.

<!-- docs: demo code properties name:d2l-sort-item sandboxTitle:'Sort Item' align:flex-start autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/sorting/sort.js';
  import '@brightspace-ui/core/components/sorting/sort-item.js';
</script>
<d2l-sort opened>
	<d2l-sort-item text="Most Relevant" value="relevant" selected></d2l-sort-item>
	<d2l-sort-item text="Recently Updated" value="updated"></d2l-sort-item>
	<d2l-sort-item text="Highest Rated" value="rating"></d2l-sort-item>
</d2l-sort>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `text` | String, required | Option text |
| `value` | String, required | Value of the option |
| `selected` | Boolean | Whether this is the selected sort option |
<!-- docs: end hidden content -->
