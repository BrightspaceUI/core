import '../table-col-sort-button.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';
import { tableStyles } from '../table-wrapper.js';

const fruits = ['Apples', 'Oranges', 'Bananas'];

const data = [
	{ name: 'Canada', fruit: { 'apples': 356863, 'oranges': 0, 'bananas': 0 }, selected: false },
	{ name: 'Australia', fruit: { 'apples': 308298, 'oranges': 398610, 'bananas': 354241 }, selected: false },
	{ name: 'Mexico', fruit: { 'apples': 716931, 'oranges': 4603253, 'bananas': 2384778 }, selected: false }
];

const formatter = new Intl.NumberFormat('en-US');

class TestTable extends RtlMixin(LitElement) {

	static get properties() {
		return {
			type: { type: String },
			stickyHeaders: { attribute: 'sticky-headers', type: Boolean },
			_sortField: { attribute: false, type: String },
			_sortDesc: { attribute: false, type: Boolean }
		};
	}

	static get styles() {
		return [tableStyles, css`
			:host {
				display: block;
			}
		`];
	}

	constructor() {
		super();
		this.sortDesc = false;
		this.stickyHeaders = false;
		this.type = 'default';
	}

	render() {
		const type = this.type === 'light' ? 'light' : 'default';
		const sorted = data.sort((a, b) => {
			if (this._sortDesc) {
				return b.fruit[this._sortField] - a.fruit[this._sortField];
			}
			return a.fruit[this._sortField] - b.fruit[this._sortField];
		});
		return html`
			<d2l-table-wrapper ?sticky-headers="${this.stickyHeaders}" type="${type}">
				<table class="d2l-table">
					<thead>
						<tr>
							<th colspan="2">Country</th>
							${fruits.map(fruit => this._renderSortButton(fruit))}
						</tr>
					</thead>
					<tbody>
						${sorted.map((row) => html`
							<tr ?data-selected="${row.selected}">
								<th><input type="checkbox" .checked="${row.selected}" @click="${this._selectRow}"></th>
								<th>${row.name}</th>
								${fruits.map((fruit) => html`<td>${formatter.format(row.fruit[fruit.toLowerCase()])}</td>`)}
							</tr>
						`)}
					</tbody>
				</table>
			</d2l-table-wrapper>
		`;
	}

	_handleSort(e) {
		const field = e.target.innerText.toLowerCase();
		const desc = e.target.hasAttribute('desc');
		this._sortField = field;
		this._sortDesc = !desc;
	}

	_renderSortButton(fruit) {
		const noSort = this._sortField !== fruit.toLowerCase();
		return html`
			<th>
				<d2l-table-col-sort-button
					@click="${this._handleSort}"
					?desc="${this._sortDesc}"
					?nosort="${noSort}">${fruit}</d2l-table-col-sort-button>
			</th>
		`;
	}

	_selectRow(e) {
		const country = e.target.parentNode.nextElementSibling.innerText;
		data.forEach((row) => {
			if (row.name === country) {
				row.selected = e.target.checked;
				this.requestUpdate();
			}
		});
	}

}
customElements.define('d2l-test-table', TestTable);
