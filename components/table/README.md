# Table

The `d2l-table-wrapper` element can be combined with table styles to apply default/light styling, row selection styles, overflow scrolling and sticky headers to native `<table>` elements within your Lit components.

![table with default style](./screenshots/default.png?raw=true)

Because the `<table>` element is part of `d2l-table-wrapper`'s slotted content, your element is responsible for importing and applying `tableStyles`.

```javascript
import { html, LitElement } from 'lit-element/lit-element.js';
import { tableStyles } from '../table-wrapper.js';

class MyElem extends LitElement {

  static get styles() {
    return tableStyles;
  }

  render() {
    return html`
      <d2l-table-wrapper>
        <table class="d2l-table">
          <thead>
            <th>Column A</th>
              <th>Column B</th>
          </tead>
          <tbody>
              <td>Cell 1-A</td>
              <td>Cell 1-B</td>
          </tbody>
        </table>
      </d2l-table-wrapper>
    `;
  }

}
```

**Properties:**

| Property | Type | Description |
|--|--|--|
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

## Selection

If your table supports row selection, apply the `data-selected` attribute to `<tr>` row elements which are actively selected.

![table with selection](./screenshots/selection.gif?raw=true)

```html
<tr data-selected>
  <td><input type="checkbox"></td>
  <td>this row is selected</td>
</tr>
```

## Sortable Column Buttons

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

**Properties:**

| Property | Type | Description |
|--|--|--|
| `desc` | Boolean, default: `false` | Whether sort direction is descending |
| `nosort` | Booealn, default: `false` | Column is not currently sorted |

## Sticky Headers

For long tables, the header row can be made to "stick" in place as the user scrolls.

![table with sticky headers](./screenshots/sticky.gif?raw=true)

```html
<d2l-table-wrapper sticky-headers>
  <table class="d2l-table">...</table>
</d2l-table-wrapper>
```

Looking for an enhancement not listed here? Create a GitHub issue!
