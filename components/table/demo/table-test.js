import '../table-col-sort-button.js';
import '../table-controls.js';
import '../../dropdown/dropdown-button-subtle.js';
import '../../dropdown/dropdown-menu.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../selection/selection-action.js';
import '../../selection/selection-action-dropdown.js';
import '../../selection/selection-action-menu-item.js';
import '../../selection/selection-input.js';

import { css, html } from 'lit';
import { tableStyles, TableWrapper } from '../table-wrapper.js';
import { DemoPassthroughMixin } from '../../demo/demo-passthrough-mixin.js';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';

const fruits = ['Apples', 'Oranges', 'Bananas'];
const thText = ['Additional', 'Placeholder', 'Header', 'Row'];

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

class TestTable extends RtlMixin(DemoPassthroughMixin(TableWrapper, 'd2l-table-wrapper')) {

	static get properties() {
		return {
			stickyControls: { attribute: 'sticky-controls', type: Boolean, reflect: true },
			visibleBackground: { attribute: 'visible-background', type: Boolean, reflect: true },
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
			:host([visible-background]) {
				--d2l-table-controls-background-color: #dddddd;
			}
		`];
	}

	constructor() {
		super();
		this._data = data();
	}

	render() {
		const sorted = this._data.sort((a, b) => {
			if (this._sortDesc) {
				return b.fruit[this._sortField] - a.fruit[this._sortField];
			}
			return a.fruit[this._sortField] - b.fruit[this._sortField];
		});
		return html`
			<d2l-table-wrapper>
				<d2l-table-controls slot="controls" ?no-sticky="${!this.stickyControls}">
					<d2l-selection-action
						text="Sticky controls"
						icon="tier1:${this.stickyControls ? 'check' : 'close-default'}"
						@d2l-selection-action-click="${this._toggleStickyControls}"
					></d2l-selection-action>
					<d2l-selection-action
						text="Sticky headers"
						icon="tier1:${this.stickyHeaders ? 'check' : 'close-default'}"
						@d2l-selection-action-click="${this._toggleStickyHeaders}"
					></d2l-selection-action>
				</d2l-table-controls>

				<table class="d2l-table">
					<thead>
						<tr>
							<th scope="col" sticky><d2l-selection-select-all></d2l-selection-select-all></th>
							<th scope="col">Country</th>
							${fruits.map(fruit => this._renderSortButton(fruit))}
						</tr>
						${[1, 2].map(() => html`
							<tr>
								<th scope="col" sticky></th>
								${thText.map(text => html`<th scope="col">${text}</th>`)}
							</tr>
						`)}
					</thead>
					<tbody>
						${sorted.map(row => html`
							<tr ?selected="${row.selected}" data-name="${row.name}">
								<th scope="row" sticky>
									<d2l-selection-input
										@d2l-selection-change="${this._selectRow}"
										?selected="${row.selected}"
										key="${row.name}"
										label="${row.name}">
									</d2l-selection-input>
								</th>
								<th scope="row">${row.name}</th>
								${fruits.map(fruit => html`<td>${formatter.format(row.fruit[fruit.toLowerCase()])}</td>`)}
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

	_toggleStickyControls() {
		this.stickyControls = !this.stickyControls;
	}

	_toggleStickyHeaders() {
		this.stickyHeaders = !this.stickyHeaders;
	}

}
customElements.define('d2l-test-table', TestTable);
