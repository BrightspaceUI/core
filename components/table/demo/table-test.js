import '../table-col-sort-button.js';
import '../../selection/selection-header.js';
import '../../selection/selection-input.js';

import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';
import { tableStyles } from '../table-wrapper.js';

const fruits = ['Apples', 'Oranges', 'Bananas'];

const data = () => [
	{ name: 'Canada', fruit: { 'apples': 356863, 'oranges': 0, 'bananas': 0 }, selected: true },
	{ name: 'Australia', fruit: { 'apples': 308298, 'oranges': 398610, 'bananas': 354241 }, selected: true },
	{ name: 'Mexico', fruit: { 'apples': 716931, 'oranges': 4603253, 'bananas': 2384778 }, selected: false },
	{ name: 'Brazil', fruit: { 'apples': 1300000, 'oranges': 50000, 'bananas': 6429875 }, selected: false },
	{ name: 'England', fruit: { 'apples': 345782, 'oranges': 4, 'bananas': 1249875 }, selected: false },
	{ name: 'Hawaii', fruit: { 'apples': 129875, 'oranges': 856765, 'bananas': 123 }, selected: false },
	{ name: 'Japan', fruit: { 'apples': 8534, 'oranges': 1325, 'bananas': 78382756 }, selected: false }
];

const formatter = new Intl.NumberFormat('en-US');

class TestTable extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Hides the column borders on "default" table type
			 * @type {boolean}
			 */
			noColumnBorder: { attribute: 'no-column-border', type: Boolean },
			/**
			 * Type of table style to apply
			 * @type {'default'|'light'}
			 */
			type: { type: String },
			/**
			 * Whether header row is sticky
			 * @type {boolean}
			 */
			stickyHeaders: { attribute: 'sticky-headers', type: Boolean },
			_data: { state: true },
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
		this.noColumnBorder = false;
		this.sortDesc = false;
		this.stickyHeaders = false;
		this.type = 'default';
		this._data = data();
	}

	render() {
		const type = this.type === 'light' ? 'light' : 'default';
		const sorted = this._data.sort((a, b) => {
			if (this._sortDesc) {
				return b.fruit[this._sortField] - a.fruit[this._sortField];
			}
			return a.fruit[this._sortField] - b.fruit[this._sortField];
		});
		return html`
			<d2l-table-wrapper ?no-column-border="${this.noColumnBorder}" ?sticky-headers="${this.stickyHeaders}" type="${type}">
				<d2l-selection-header slot="header" no-sticky></d2l-selection-header>
				<table class="d2l-table">
					<thead>
						<tr>
							<th scope="col" colspan="2">Country</th>
							${fruits.map(fruit => this._renderSortButton(fruit))}
						</tr>
					</thead>
					<tbody>
						${sorted.map((row) => html`
							<tr ?selected="${row.selected}" data-name="${row.name}">
								<th scope="row">
									<d2l-selection-input
										@d2l-selection-change="${this._selectRow}"
										?selected="${row.selected}"
										key="${row.name}"
										label="${row.name}">
									</d2l-selection-input>
								</th>
								<th scope="row">${row.name}</th>
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
			<th scope="col">
				<d2l-table-col-sort-button
					@click="${this._handleSort}"
					?desc="${this._sortDesc}"
					?nosort="${noSort}">${fruit}</d2l-table-col-sort-button>
			</th>
		`;
	}

	_selectRow(e) {
		const country = e.target.parentNode.parentNode.dataset.name;
		const row = this._data.find(row => row.name === country);
		row.selected = e.target.selected;
		this.requestUpdate();
	}

}
customElements.define('d2l-test-table', TestTable);
