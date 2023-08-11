# Paging

The paging components and mixins can be used to provide consistent paging functionality.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/paging/pager-load-more.js';
  import { html, LitElement } from 'lit';
  import { PageableMixin } from '@brightspace-ui/core/components/paging/pageable-mixin.js';

  class PageableExample extends PageableMixin(LitElement) {
    render() {
      return html`
        <slot @slotchange="${this._handleSlotChange}"></slot>
        ${this._renderPagerContainer()}
      `;
    }
    _getItemByIndex(index) {
      return this._getItems()[index];
    }
    _getItems() {
      return this.shadowRoot.querySelector('slot').assignedElements().find(node => node.tagName === 'UL').querySelectorAll('li');
    }
    _getItemShowingCount() {
      return this._getItems().length;
    }
    _handleSlotChange(e) {
      const list = e.target.assignedElements().find(node => node.tagName === 'UL');
      if (!this._mutationObserver) {
        this._mutationObserver = new MutationObserver(() => this._updateItemShowingCount());
      } else {
        this._mutationObserver.disconnect();
      }
      this._mutationObserver.observe(list, { childList: true });
    }
  }
  customElements.define('d2l-pageable-example', PageableExample);

  document.querySelector('d2l-pager-load-more').addEventListener('d2l-pager-load-more', (e) => {
    const ITEM_COUNT = 12;
    const PAGE_SIZE = 3;

    const list = e.target.parentNode.querySelector('ul');
    let remainingCount = ITEM_COUNT - list.children.length;
    const numberToLoad = remainingCount < PAGE_SIZE ? remainingCount : PAGE_SIZE;
    for (let i = 0; i < numberToLoad; i++) {
      const newItem = list.lastElementChild.cloneNode(true);
      newItem.textContent = `item ${list.children.length + 1}`;
      list.appendChild(newItem);
    }
    if (list.children.length === ITEM_COUNT) {
      e.target.hasMore = false;
    } else {
      remainingCount = ITEM_COUNT - list.children.length;
      if (remainingCount < PAGE_SIZE && e.target.pageSize) e.target.pageSize = remainingCount;
    }
    e.detail.complete();
  });
</script>
<d2l-pageable-example item-count="12" style="width: 100%;">
  <ul>
    <li>item 1</li>
    <li>item 2</li>
  </ul>
  <d2l-pager-load-more slot="pager" has-more page-size="3"></d2l-pager-load-more>
</d2l-pageable-example>
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
