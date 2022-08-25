import '../../dropdown/dropdown-button-subtle.js';
import '../../dropdown/dropdown-menu.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../selection/selection-action.js';
import '../../selection/selection-action-dropdown.js';
import '../../selection/selection-action-menu-item.js';
import '../../selection/selection-input.js';
import '../../selection/selection-select-all.js';
import '../../selection/selection-summary.js';

import '../table-col-sort-button.js';
import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';
import { tableStyles } from '../table-wrapper.js';

const fruits = ['Apples', 'Oranges', 'Bananas'];

const data = [
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
			.actions-header {
				align-items: center;
				border: 1px solid transparent;
				display: flex;
				gap: 0.2rem;
				padding: 0.5rem 1rem;
			}
		`];
	}

	constructor() {
		super();
		this.noColumnBorder = false;
		this.sortDesc = false;
		this.stickyHeaders = false;
		this.type = 'default';
		this._data = [];
		data.forEach(item => this._data.push(item));
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
				<div class="actions-header" @d2l-selection-action-click="${this._handleAction}">
					<d2l-selection-select-all></d2l-selection-select-all>
					<d2l-selection-summary></d2l-selection-summary>
					<d2l-selection-action icon="tier1:plus-default" text="Add"></d2l-selection-action>
					<d2l-selection-action-dropdown text="Move To" requires-selection>
						<d2l-dropdown-menu>
							<d2l-menu label="Move To Options">
								<d2l-menu-item text="Top of Quiz"></d2l-menu-item>
								<d2l-menu-item text="Bottom of Quiz"></d2l-menu-item>
								<d2l-menu-item text="Section">
									<d2l-menu>
										<d2l-menu-item text="Option 1"></d2l-menu-item>
										<d2l-menu-item text="Option 2"></d2l-menu-item>
									</d2l-menu>
								</d2l-menu-item>
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-selection-action-dropdown>
					<d2l-dropdown-button-subtle text="Actions">
						<d2l-dropdown-menu>
							<d2l-menu label="Actions">
								<d2l-selection-action-menu-item text="Bookmark (requires selection)" requires-selection></d2l-selection-action-menu-item>
								<d2l-selection-action-menu-item text="Advanced"></d2l-selection-action-menu-item>
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-dropdown-button-subtle>
					<d2l-selection-action icon="tier1:gear" text="Settings" requires-selection></d2l-selection-action>
				</div>
				<table class="d2l-table">
					<thead>
						<tr>
							<th colspan="2">Country</th>
							${fruits.map(fruit => this._renderSortButton(fruit))}
						</tr>
					</thead>
					<tbody>
						${sorted.map((row) => html`
							<tr ?selected="${row.selected}">
								<th>
								<d2l-selection-input
									@d2l-selection-change="${this._selectRow}"
									?selected="${row.selected}"
									key="${row.name}"
									label="${row.name}">
								</d2l-selection-input>
								</th>
								<th>${row.name}</th>
								${fruits.map((fruit) => html`<td>${formatter.format(row.fruit[fruit.toLowerCase()])}</td>`)}
							</tr>
						`)}
					</tbody>
				</table>
			</d2l-table-wrapper>
		`;
	}

	_handleAction(e) {
		console.log(e.detail);
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
		const row = this._data.find(row => row.name === country);
		row.selected = e.target.selected;
		this.requestUpdate();
	}

}
customElements.define('d2l-test-table', TestTable);
