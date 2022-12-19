# Tag List
*This component is in progress. The API is generally stable but there could be some appearance or minor behavior churn in the short-term.*

Tag lists are used to present a list of compact, discrete pieces of information.

<!-- docs: demo autoSize:false display:block size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tag-list/tag-list.js';
  import '@brightspace-ui/core/components/tag-list/tag-list-item.js';
</script>

<d2l-tag-list description="Example Tags">
  <d2l-tag-list-item text="Lorem ipsum dolor"></d2l-tag-list-item>
  <d2l-tag-list-item text="Reprehenderit in voluptate velit esse lorem ipsum dolor"></d2l-tag-list-item>
  <d2l-tag-list-item text="Sit amet"></d2l-tag-list-item>
  <d2l-tag-list-item text="Duis aute irure"></d2l-tag-list-item>
  <d2l-tag-list-item text="Excepteur sint"></d2l-tag-list-item>
  <d2l-tag-list-item text="Cillum"></d2l-tag-list-item>
  <d2l-tag-list-item text="Saunt in culpa"></d2l-tag-list-item>
  <d2l-tag-list-item text="Laboris nisi"></d2l-tag-list-item>
</d2l-tag-list>
```

## Tag List [d2l-tag-list]

The `d2l-tag-list` element can take a combination of any type of `d2l-tag-list-item` and adds the appropriate keyboard navigation, list semantics, clearing behaviour and responsive behaviour.

### Clearable

The corresponding `*-clear` event must be listened to for whatever component (`d2l-tag-list` or `d2l-tag-list-item`) has `clearable` on it and that listener must handle individual `d2l-tag-list-item` deletion as well as potentially focus behavior (see individual event descriptions).

<!-- docs: demo live name:d2l-tag-list autoSize:false display:block size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tag-list/tag-list.js';
  import '@brightspace-ui/core/components/tag-list/tag-list-item.js';

  document.addEventListener('d2l-tag-list-item-clear', (e) => {
    e.target.parentNode.removeChild(e.target);
    console.log(`d2l-tag-list-item-clear event dispatched. Value: ${e.detail.value}`);
  });

  document.addEventListener('d2l-tag-list-clear', (e) => {
    const items = e.target.querySelectorAll('d2l-tag-list-item');
    items.forEach((item) => {
      item.parentNode.removeChild(item);
    });
    console.log('d2l-tag-list-clear event dispatched');
  });
</script>
<d2l-tag-list description="Example Tags" clearable>
  <d2l-tag-list-item text="Lorem ipsum dolor"></d2l-tag-list-item>
  <d2l-tag-list-item text="Reprehenderit in voluptate velit esse lorem ipsum dolor"></d2l-tag-list-item>
  <d2l-tag-list-item text="Sit amet"></d2l-tag-list-item>
  <d2l-tag-list-item text="Duis aute irure"></d2l-tag-list-item>
</d2l-tag-list>
```

## Tag List Item [d2l-tag-list-item]
The `d2l-tag-list-item` provides the appropriate semantics and styling for children within a tag list. Tag List items do not work outside of a Tag List and should not be used on their own.

<!-- docs: demo live name:d2l-tag-list-item autoSize:false display:block size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tag-list/tag-list.js';
  import '@brightspace-ui/core/components/tag-list/tag-list-item.js';

  document.addEventListener('d2l-tag-list-item-clear', (e) => {
    e.target.parentNode.removeChild(e.target);
    console.log(`d2l-tag-list-item-clear event dispatched. Value: ${e.detail.value}`);
  });

  document.addEventListener('d2l-tag-list-clear', (e) => {
    const items = e.target.querySelectorAll('d2l-tag-list-item');
    items.forEach((item) => {
      item.parentNode.removeChild(item);
    });
    console.log('d2l-tag-list-clear event dispatched');
  });
</script>

<d2l-tag-list description="Example Tags" clearable>
  <d2l-tag-list-item text="Tag"></d2l-tag-list-item>
</d2l-tag-list>
```

<!-- docs: start hidden content -->
### `d2l-tag-list-item` properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed on the tag item. Will truncate automatically if text exceeds a certain width and will display full `text` value in a tooltip. |
| `description` | String, optional | Additional text to display in tag item tooltip. Setting this property will make tooltip available at all times when hovering. |
<!-- docs: end hidden content -->
