# Tables

Tables are used to display tabular data in rows and columns of cells. They can allow users to select rows and sort by columns.

<!-- docs: start hidden content -->
![table with default style](./screenshots/default.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/table/demo/table-test.js';
</script>
<d2l-test-table></d2l-test-table>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Do use tables to display complex data sets.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use tables to display a simple list of objects or entities; consider using the list component for this instead.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Responsive Behavior
If the browser window is too narrow to accommodate the table’s contents, a scroll button is shown. This button alerts users to the fact that there’s more content to see, and provides a straightforward way for users to scroll horizontally through the table regardless of whether a horizontal scrollbar is visible.

The scroll button sticks to the top of the table, like a sticky header, so that it never falls out of view while the table is on the page.

Note: If the browser window is very narrow — for example, on a mobile device — it may be preferable to replace a wide table with a list, a set of cards, or some other alternate component. However, the responsive table component provides a consistent fallback that will work reasonably well for any table on any page.

## Table Wrapper [d2l-table-wrapper]

The `d2l-table-wrapper` element can be combined with table styles to apply default/light styling, row selection styles, overflow scrolling and sticky headers to native `<table>` elements within your Lit components.

See [creation of table component](#creation-of-table-component) for how to create a table component that uses the wrapper and shared styles. The example below uses a component similar to the code in the example in that section.

<!-- docs: demo live name:d2l-test-table autoSize:false display:block size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/table/demo/table-test.js';
</script>
<d2l-test-table></d2l-test-table>
```

## Creation of Table Component

Because the `<table>` element is part of `d2l-table-wrapper`'s slotted content, your element is responsible for importing and applying `tableStyles`.

```javascript
import { html, LitElement } from 'lit-element/lit-element.js';
import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

class TestTable extends LitElement {

  static get styles() {
    return tableStyles;
  }

  render() {
    return html`
      <d2l-table-wrapper>
        <table class="d2l-table">
          <thead>
            <tr>
              <th>Column A</th>
              <th>Column B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cell 1-A</td>
              <td>Cell 1-B</td>
            </tr>
          </tbody>
        </table>
      </d2l-table-wrapper>
    `;
  }

}
customElements.define('d2l-test-table', TestTable);
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `no-column-border` | Boolean, default: `false` | Hides the column borders on "default" table type |
| `sticky-headers` | Boolean, default: `false` | Whether to make the header row sticky |
| `type` | String, default: `'default'` | Type of the table style. Can be one of  `default`, `light`. |

## Light Type

For a table style with fewer borders and tighter padding, there's the `light` type:

![table with light style](./screenshots/light.png?raw=true)

```html
<d2l-table-wrapper type="light">
  <table class="d2l-table">...</table>
</d2l-table-wrapper>
```

## Sticky Headers

For long tables, the header row can be made to "stick" in place as the user scrolls.

![table with sticky headers](./screenshots/sticky.gif?raw=true)

```html
<d2l-table-wrapper sticky-headers>
  <table class="d2l-table">...</table>
</d2l-table-wrapper>
```
<!-- docs: end hidden content -->

## Sortable Column Buttons [d2l-table-col-sort-button]

When tabular data can be sorted, the `<d2l-table-col-sort-button>` can be used to provide an interactive sort button as well as arrows to indicate the ascending/descending sort direction.

![table with sorting](./screenshots/sorting.gif?raw=true)

```html
<table class="d2l-table">
  <thead>
    <tr>
      <th><d2l-table-col-sort-button>Ascending</d2l-table-col-sort-button></th>
      <th><d2l-table-col-sort-button desc>Descending</d2l-table-col-sort-button></th>
      <th><d2l-table-col-sort-button nosort>Not Sorted</d2l-table-col-sort-button></th>
    </tr>
  </thead>
</table>
```

### Properties

| Property | Type | Description |
|---|---|---|
| `desc` | Boolean, default: `false` | Whether sort direction is descending |
| `nosort` | Booealn, default: `false` | Column is not currently sorted. Hides the ascending/descending sort icon. |

## Selection

If your table supports row selection, apply the `selected` attribute to `<tr>` row elements which are actively selected.

![table with selection](./screenshots/selection.gif?raw=true)

```html
<tr selected>
  <td><input type="checkbox"></td>
  <td>this row is selected</td>
</tr>
```
