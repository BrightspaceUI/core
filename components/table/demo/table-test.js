import '../table-col-sort-button.js';
import '../table-controls.js';
import '../../dropdown/dropdown-button-subtle.js';
import '../../dropdown/dropdown-menu.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../paging/pager-load-more.js';
import '../../selection/selection-action.js';
import '../../selection/selection-action-dropdown.js';
import '../../selection/selection-action-menu-item.js';
import '../../selection/selection-input.js';

import { css, html, nothing } from 'lit';
import { tableStyles, TableWrapper } from '../table-wrapper.js';
import { DemoPassthroughMixin } from '../../demo/demo-passthrough-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RtlMixin } from '../../../mixins/rtl/rtl-mixin.js';

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
			paging: { type: Boolean, reflect: true },
			stickyControls: { attribute: 'sticky-controls', type: Boolean, reflect: true },
			visibleBackground: { attribute: 'visible-background', type: Boolean, reflect: true },
			_data: { state: true },
			_sortField: { state: true },
			_sortDesc: { state: true }
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
			.sortableCell {
				padding: 0 !important;
			}
		`];
	}

	constructor() {
		super();

		this.paging = false;
		this.stickyControls = false;
		this.visibleBackground = false;
		this._data = data();
		this._sortField = undefined;
		this._compositeField = undefined;
		this._sortDesc = false;
	}

	render() {
		const sorted = this._data.sort((a, b) => {
			if (this._sortDesc) {
				return ifDefined(this._compositeField) ?
					b.fruit[this._sortField] - a.fruit[this._sortField] || b.name - a.name :
					b.fruit[this._sortField] - a.fruit[this._sortField];
			}
			return ifDefined(this._compositeField) ?
				a.fruit[this._sortField] - b.fruit[this._sortField] || a.name - b.name :
				a.fruit[this._sortField] - b.fruit[this._sortField];
		});
		return html`
			<d2l-table-wrapper item-count="${ifDefined(this.paging ? 500 : undefined)}">
				<d2l-table-controls slot="controls" ?no-sticky="${!this.stickyControls}" select-all-pages-allowed>
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
					</thead>
					<tbody>
						<tr class="d2l-table-header">
							<th scope="col" sticky></th>
							${thText.map(text => html`<th scope="col">${text}</th>`)}
						</tr>
						<tr header>
							<th scope="col" sticky></th>
							${thText.map(text => html`<th scope="col">${text}</th>`)}
						</tr>
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
				${this.paging ? html`<d2l-pager-load-more slot="pager"
					has-more
					page-size="3"
					@d2l-pager-load-more="${this._handlePagerLoadMore}"
				></d2l-pager-load-more>` : nothing}
			</d2l-table-wrapper>
		`;
	}

	_handleAtoZ(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');

		if (sortButtonComponent) {
			const field = sortButtonComponent.innerText.toLowerCase();
			const desc = false;
			this._sortField = field;
			this._compositeField = undefined;
			this._sortDesc = !desc;
		}
	}

	_handleCompositeAtoZ(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');

		if (sortButtonComponent) {
			const field = sortButtonComponent.innerText.toLowerCase();
			const desc = false;
			this._sortField = field;
			this._compositeField = false;
			this._sortDesc = !desc;
		}
	}

	_handleCompositeZtoA(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');

		if (sortButtonComponent) {
			const field = sortButtonComponent.innerText.toLowerCase();
			const desc = true;
			this._sortField = field;
			this._compositeField = true;
			this._sortDesc = !desc;
		}
	}

	_handlePagerLoadMore(e) {
		const startIndex = this._data.length + 1;
		for (let i = 0; i < e.target.pageSize; i++) {
			this._data.push({ name: `Country ${startIndex + i}`, fruit: { 'apples': 8534, 'oranges': 1325, 'bananas': 78382756 }, selected: false });
		}
		this.requestUpdate();
		e.detail.complete();
	}

	_handleSort(e) {
		const field = e.target.innerText.toLowerCase();
		this._sortField = field;
	}

	_handleZtoA(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');

		if (sortButtonComponent) {
			const field = sortButtonComponent.innerText.toLowerCase();
			const desc = true;
			this._sortField = field;
			this._compositeField = undefined;
			this._sortDesc = !desc;
		}
	}

	_renderSortButton(fruit) {
		const noSort = this._sortField !== fruit.toLowerCase();
		return html`
			<th class="sortableCell" scope="col">
				<d2l-table-col-sort-button
					@click="${this._handleSort}"
					?desc="${this._sortDesc}"
					?nosort="${noSort}">
					${fruit}
					<d2l-menu-item slot="items" text="A to Z" @click="${this._handleAtoZ}"></d2l-menu-item>
					<d2l-menu-item slot="items" text="Z to A" @click="${this._handleZtoA}"></d2l-menu-item>
					<d2l-menu-item slot="items" text="Country, A to Z" @click="${this._handleCompositeAtoZ}"></d2l-menu-item>
					<d2l-menu-item slot="items" text="Country, Z to A" @click="${this._handleCompositeZtoA}"></d2l-menu-item>
				</d2l-table-col-sort-button>
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
