# Paging

The paging components and mixins can be used to provide consistent paging functionality.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/paging/pager-load-more.js';
</script>
<d2l-pager-load-more has-more page-size="3"></d2l-pager-load-more>
```

## Load More Paging [d2l-pager-load-more]

The `d2l-pager-load-more` component can be used in conjunction with pageable components such as `d2l-list` to provide load-more paging functionality. The pager will dispatch the `d2l-pager-load-more` when clicked, and then the consumer handles the event by loading more items, updating the pager state, and signalling completion by calling `complete()` on the event detail. Focus will be automatically moved on the first new item once complete.

See [Pageable Lists](../../components/list/#pageable-lists).

```html
<d2l-list item-count="85">
  <d2l-list-item ...></d2l-list-item>
  <d2l-list-item ...></d2l-list-item>
  <d2l-pager-load-more slot="pager" has-more page-size="10"></d2l-pager-load-more>
</d2l-list>
```

```javascript
pager.addEventListener('d2l-pager-load-more', e => {
  // load more items
 ...

  e.detail.complete();
});
```

### Properties
| Property | Type | Description |
|---|---|---|
| `has-more` | Boolean, default: `false` | Whether there are more items that can be loaded. |
| `page-size` | Number | The number of additional items to load. If not given, the component will simply show `Load More` without any value. |

### Events

| Event | Description |
|---|---|
| `d2l-pager-load-more` | Dispatched when the user clicks the Load More button. The `pageSize` can be accessed from the event `target`. The consumer must call the `complete()` method on the event detail to signal completion after the new items have been loaded. |
