# Tag List
*This component is in progress. The API is generally stable but the ability to clear tags is currently a WIP.*

Tag lists are used to present a list of compact, discrete pieces of information.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tag-list/tag-list.js';
  import '@brightspace-ui/core/components/tag-list/tag-list-item.js';
</script>

<d2l-tag-list description="Example Tags">
  <d2l-tag-list-item text="Lorem ipsum dolor"></d2l-tag-list-item>
  <d2l-tag-list-item text="Reprehenderit in voluptate velit esse"></d2l-tag-list-item>
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

<!-- docs: demo live name:d2l-tag-list display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tag-list/tag-list.js';
  import '@brightspace-ui/core/components/tag-list/tag-list-item.js';
</script>

<d2l-tag-list description="Example Tags">
  <d2l-tag-list-item text="Lorem ipsum dolor"></d2l-tag-list-item>
  <d2l-tag-list-item text="Reprehenderit in voluptate velit esse"></d2l-tag-list-item>
  <d2l-tag-list-item text="Sit amet"></d2l-tag-list-item>
  <d2l-tag-list-item text="Duis aute irure"></d2l-tag-list-item>
</d2l-tag-list>
```

## Tag List Item [d2l-tag-list-item]
The `d2l-tag-list-item` provides the appropriate `listitem` semantics and styling for children within a tag list. Tag List items do not work outside of a Tag List and should not be used on their own.

<!-- docs: demo live name:d2l-tag-list-item display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/tag-list/tag-list.js';
  import '@brightspace-ui/core/components/tag-list/tag-list-item.js';
</script>

<d2l-tag-list description="Example Tags">
  <d2l-tag-list-item text="Tag"></d2l-tag-list-item>
</d2l-tag-list>
```
