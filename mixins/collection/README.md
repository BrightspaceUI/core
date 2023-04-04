# CollectionMixin

The `CollectionMixin` describes a collection of items like a list or table. It has one attribute, `item-count`, which optionally defines the total number of items in the collection. This may be greater than the number of items currently displayed, and is useful for actions like select-all and paging.

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Consider the performance impact of acquiring the optional total `item-count`. The `item-count` provides useful context for the user, but counting large numbers of rows can be detrimental to performance. As a very general guide, when the total number of rows that needs to be counted is < 50,000, it's not a performance concern.
<!-- docs: end dos -->
<!-- docs: end best practices -->

## Usage

Apply the mixin and access the `itemCount` property as needed. Note that `itemCount` has a default value of `null` to indicate that no count was specified.

```js
import { CollectionMixin } from '@brightspace-ui/core/mixins/collection-mixin.js';

class MyComponent extends CollectionMixin(LitElement) {
  render() {
	const itemCountToDisplay = this.itemCount !== null ? this.itemCount : 'Unspecified';
	return html`
		<p>Total number of items: ${itemCountToDisplay}</p>
		<slot></slot>
	`;
  }
}
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `item-count` | Number | Total number of items. Required when selecting all pages is allowed. |
<!-- docs: end hidden content -->
