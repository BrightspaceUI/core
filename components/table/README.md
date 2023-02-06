# Tables

Tables are used to display tabular data in rows and columns. They can allow users to select rows and sort by columns.

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
* Use a table if your data has many dimensions
* Use a table when your data has multiple dimensions and any of the following are true:
  * There are more than just a few dimensions
  * The dimensions need to be sortable
  * The dimensions need to be easily compared across rows (ie- scannable)
* Specify [column and row headings](https://www.w3.org/WAI/tutorials/tables/) so data is meaningful to screen reader users
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use a table to display data that should appear as cohesive objects or entities - use a list instead
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Responsive Behavior
If the browser window is too narrow to display the table’s contents, a scroll button appears. This alerts users to overflowing content and provides a way for users to scroll horizontally. The scroll button sticks to the top of the screen so that it's available as long as the table is in the viewport.

<!-- docs: demo size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/table/demo/table-test.js';
</script>
<div style="width: 400px;">
  <d2l-test-table wide></d2l-test-table>
</div>
```

If the viewport is very narrow — for example, on a mobile device — it may be preferable to replace a wide table with a list, a set of cards, or an alternate layout. However, the responsive table component works well as a consistent fallback solution.

## Table Wrapper [d2l-table-wrapper]

The `d2l-table-wrapper` element can be combined with table styles to apply default/light styling, row selection styles, overflow scrolling and sticky headers to native `<table>` elements within your Lit components.

<!-- docs: demo live name:d2l-table-wrapper display:block -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

  const fruits = ['Apples', 'Oranges', 'Bananas'];

  const data = [
    { name: 'Canada', fruit: { 'apples': 356863, 'oranges': 0, 'bananas': 0 }, selected: false },
    { name: 'Australia', fruit: { 'apples': 308298, 'oranges': 398610, 'bananas': 354241 }, selected: false },
    { name: 'Mexico', fruit: { 'apples': 716931, 'oranges': 4603253, 'bananas': 2384778 }, selected: false },
    { name: 'Brazil', fruit: { 'apples': 1300000, 'oranges': 50000, 'bananas': 6429875 }, selected: false },
    { name: 'England', fruit: { 'apples': 345782, 'oranges': 4, 'bananas': 1249875 }, selected: false },
    { name: 'Hawaii', fruit: { 'apples': 129875, 'oranges': 856765, 'bananas': 123 }, selected: false },
    { name: 'Japan', fruit: { 'apples': 8534, 'oranges': 1325, 'bananas': 78382756 }, selected: false }
  ];

  class SampleTable extends LitElement {

    static get styles() {
      return tableStyles;
    }

    render() {
      const type = this.type === 'light' ? 'light' : 'default';

      return html`
        <d2l-table-wrapper>
          <table class="d2l-table">
            <thead>
              <tr>
                <th>Country</th>
                ${fruits.map((fruit) => html`<th>${fruit}</th>`)}
              </tr>
            </thead>
            <tbody>
              ${data.map((row) => html`
                <tr>
                  <th>${row.name}</th>
                  ${fruits.map((fruit) => html`<td>${row.fruit[fruit.toLowerCase()]}</td>`)}
                </tr>
              `)}
            </tbody>
          </table>
        </d2l-table-wrapper>
      `;
    }

  }
  customElements.define('d2l-sample-table', SampleTable);
</script>
<d2l-sample-table></d2l-sample-table>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description | Default Value |
|---|---|---|---|
| `no-column-border` | boolean | Hides the column borders on "default" table type | false |
| `sticky-headers` | boolean | Whether to make the header row sticky | false |
| `type` | string | Type of the table style. Can be one of  `default`, `light`. | 'default' |

## Light Type

For a table style with fewer borders and tighter padding, there's the `light` type:

```html
<d2l-table-wrapper type="light">
  <table class="d2l-table">...</table>
</d2l-table-wrapper>
```

## Sticky Headers

For long tables, the header row can be made to "stick" in place as the user scrolls.

```html
<d2l-table-wrapper sticky-headers>
  <table class="d2l-table">...</table>
</d2l-table-wrapper>
```
<!-- docs: end hidden content -->

## Sortable Column Buttons [d2l-table-col-sort-button]

When tabular data can be sorted, the `<d2l-table-col-sort-button>` can be used to provide an interactive sort button as well as arrows to indicate the ascending/descending sort direction.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/table/table-col-sort-button.js';
  import { html, LitElement } from 'lit';
  import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

  class MySortableTableElem extends LitElement {

    static get properties() {
      return {
        _sortDesc: { attribute: false, type: Boolean }
      };
    }

    static get styles() {
      return tableStyles;
    }

    constructor() {
      super();
      this._sortDesc = false;
    }

    render() {
      const data = [1, 2];
      const sorted = data.sort((a, b) => {
        if (this._sortDesc) {
          return b - a;
        }
        return a - b;
      });
      const rows = sorted.map(i => {
        return html`<tr>
            <td>Cell ${i}-A</td>
            <td>Cell ${i}-B</td>
          </tr>
        `;
      });

      return html`
        <d2l-table-wrapper>
          <table class="d2l-table">
            <thead>
              <tr>
                <th>
                  <d2l-table-col-sort-button
                    @click="${this._handleSort}"
                    ?desc="${this._sortDesc}">
                    Column A
                  </d2l-table-col-sort-button>
                </th>
                <th>Column B</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </d2l-table-wrapper>
      `;
    }

    _handleSort(e) {
      const desc = e.target.hasAttribute('desc');
      this._sortDesc = !desc;
    }

  }
  customElements.define('d2l-my-sortable-table-elem', MySortableTableElem);
</script>
<d2l-my-sortable-table-elem></d2l-my-sortable-table-elem>
```

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

| Property | Type | Description | Default Value |
|---|---|---|---|
| `desc` | boolean | Whether sort direction is descending | false |
| `nosort` | boolean | Column is not currently sorted. Hides the ascending/descending sort icon. | false |

## Selection

If your table supports row selection, apply the `selected` attribute to `<tr>` row elements which are actively selected.

<!-- docs: demo -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

  class MySelectableTableElem extends LitElement {

    static get properties() {
      return {
        _checked: { type: Boolean }
      }
    }

    static get styles() {
      return tableStyles;
    }

    constructor() {
      super();
      this._checked = true;
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
              <tr ?selected="${this._checked}">
                <td><input type="checkbox" ?checked="${this._checked}" @click="${this._selectRow}"></td>
                <td>this row is ${!this._checked ? 'not' : ''} selected</td>
              </tr>
            </tbody>
          </table>
        </d2l-table-wrapper>
      `;
    }

    _selectRow() {
      this._checked = !this._checked;
    }

  }
  customElements.define('d2l-my-selectable-table-elem', MySelectableTableElem);
</script>
<d2l-my-selectable-table-elem></d2l-my-selectable-table-elem>
```

```html
<tr selected>
  <td><input type="checkbox" checked></td>
  <td>this row is selected</td>
</tr>
```

## Table Controls [d2l-table-controls]

The `d2l-table-controls` component can be placed in the `d2l-table-wrapper`'s `controls` slot to provide a selection summary, a slot for `d2l-selection-action`s, and overflow-group behaviour.

<!-- docs: demo live name:d2l-table-controls display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/selection/selection-action.js';
  import '@brightspace-ui/core/components/selection/selection-input.js';
  import '@brightspace-ui/core/components/selection/selection-select-all.js';
  import '@brightspace-ui/core/components/table/table-controls.js';
  import { html, LitElement } from 'lit';
  import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

  class SampleTableWithControls extends LitElement {

    static get properties() {
      return {
        _data: { state: true }
      }
    }

    static get styles() {
      return tableStyles;
    }

    constructor() {
      super();
      this._data = {
        a: { checked: true },
        b: { checked: false },
      };
    }

    render() {
      return html`
        <d2l-table-wrapper>
          <d2l-table-controls slot="controls">
            <d2l-selection-action icon="tier1:delete" text="Delete" requires-selection></d2l-selection-action>
            <d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
          </d2l-table-controls>
          <table class="d2l-table">
            <thead>
              <tr>
                <th><d2l-selection-select-all></d2l-selection-select-all></th>
                <th>Column B</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(this._data).map((key, i) => html`
                <tr>
                  <td>
                    <d2l-selection-input key="${key}" label="${key}" ?selected="${this._data[key].checked}" @d2l-selection-change="${this._selectRow}"></d2l-selection-input>
                  </td>
                  <td>this row is ${!this._data[key].checked ? 'not' : ''} selected</td>
                </tr>
              `)}
            </tbody>
          </table>
        </d2l-table-wrapper>
      `;
    }

    _selectRow(e) {
      const key = e.target.key;
      this._data[key].checked = e.target.selected;
      this.requestUpdate();
    }

  }
  customElements.define('d2l-sample-table-with-controls', SampleTableWithControls);
</script>
<!-- docs: start hidden content -->
<style>
  #demo-element {
    margin-bottom: 300px;
    margin-top: 0;
  }
</style>
<!-- docs: end hidden content -->
<d2l-sample-table-with-controls></d2l-sample-table-with-controls>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `no-selection` | Boolean | Whether to render the selection summary |
| `no-sticky` | Boolean | Disables sticky positioning for the controls |
| `select-all-pages-allowed` | Boolean | Whether all pages can be selected |
<!-- docs: end hidden content -->
