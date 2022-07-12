# Paging

The paging components and mixins can be used to provide consistent paging functionality.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/paging/pager-load-more.js';
</script>
<d2l-pager-load-more has-more page-size="3" item-count="15"></d2l-pager-load-more>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Consider the performance impact of acquiring the optional total `item-count`. The `item-count` provides useful context for the user, but counting large numbers of rows can be detrimental to performance. As a very general guide, when the total number of rows that needs to be counted is < 50,000, it's not a performance concern.
<!-- docs: end dos -->

## Load More Paging [d2l-pager-load-more]

The `d2l-pager-load-more` component can be used in conjunction with pageable components such as `d2l-list` to provide load-more paging functionality. The pager will dispatch the `d2l-pager-load-more` when clicked, and then the consumer handles the event by loading more items, updating the pager state, and signalling completion by calling `complete()` on the event detail. Focus will be automatically moved on the first new item once complete.

See [Pageable Lists](../../components/list/#pageable-lists).

```html
<d2l-list>
  <d2l-list-item ...></d2l-list-item>
  <d2l-list-item ...></d2l-list-item>
  <d2l-pager-load-more slot="pager" has-more page-size="10" item-count="85"></d2l-pager-load-more>
</d2l-list>
```

```javascript
pager.addEventListener('d2l-pager-load-more', e => {
  // load more items
 ...

  e.detail.complete();
});
```

<!-- docs: start hidden content -->
### Properties
| Property | Type | Description |
|---|---|---|
| `has-more` | Boolean, default: `false` | Whether there are more items that can be loaded. |
| `item-count` | Number | Total number of items. If not specified, neither it nor the count of items showing will be displayed. |
| `page-size` | Number, default: 50 | The number of additional items to load. |

### Events

| Event | Description |
|---|---|
| `d2l-pager-load-more` | Dispatched when the user clicks the Load More button. The `pageSize` can be accessed from the event `target`. The consumer must call the `complete()` method on the event detail to signal completion after the new items have been loaded. |
<!-- docs: end hidden content -->
