import '../table-col-sort-button.js';
import '../table-controls.js';
import '../../button/button-icon.js';
import '../../dropdown/dropdown-button-subtle.js';
import '../../dropdown/dropdown-menu.js';
import '../../inputs/input-checkbox.js';
import '../../inputs/input-text.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../menu/menu-item-radio.js';
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

const columns = ['Population', 'Size', 'Elevation'];
const thText = ['Additional', 'Placeholder', 'Header', 'Row'];

const data = () => [
	{ name: 'Ottawa, Canada', data: { 'city': 'Ottawa', 'country': 'Canada', 'population': 994837, 'size': 2790, 'elevation': 70 }, selected: true },
	{ name: 'Toronto, Canada', data: { 'city': 'Toronto', 'country': 'Canada', 'population': 2930000, 'size': 630, 'elevation': 76 }, selected: true },
	{ name: 'Sydney, Australia', data: { 'city': 'Sydney', 'country': 'Australia', 'population': 5312000, 'size': 12368, 'elevation': 3 }, selected: false },
	{ name: 'Cairo, Egypt', data: { 'city': 'Cairo', 'country': 'Egypt', 'population': 9540000, 'size': 3085, 'elevation': 23 }, selected: false },
	{ name: 'Moscow, Russia', data: { 'city': 'Moscow', 'country': 'Russia', 'population': 12712305, 'size': 2511, 'elevation': 124 }, selected: false },
	{ name: 'London, England', data: { 'city': 'London', 'country': 'England', 'population': 8982000, 'size': 1572, 'elevation': 11 }, selected: false },
	{ name: 'Tokyo, Japan', data: { 'city': 'Tokyo', 'country': 'Japan', 'population': 13960000, 'size': 2194, 'elevation': 40 }, selected: false }
];

const formatter = new Intl.NumberFormat('en-US');

class TestTable extends RtlMixin(DemoPassthroughMixin(TableWrapper, 'd2l-table-wrapper')) {

	static get properties() {
		return {
			paging: { type: Boolean, reflect: true },
			showButtons: { type: Boolean, attribute: 'show-buttons' },
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
		`];
	}

	constructor() {
		super();

		this.paging = false;
		this.showButtons = false;
		this.stickyControls = false;
		this.visibleBackground = false;
		this._data = data();
		this._sortField = undefined;
		this._sortDesc = false;
	}

	render() {
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
							${this._renderDoubleSortButton('City, Country')}
							${columns.map(columnHeading => this._renderSortButton(columnHeading))}
						</tr>
					</thead>
					<tbody>
						<tr class="d2l-table-header">
							<th scope="col" sticky></th>
							${thText.map(text => html`<th scope="col">${text}</th>`)}
						</tr>
						<tr header>
							<th scope="col" sticky></th>
							${thText.map(text => html`
								<th scope="col">
									${text}${text === 'Placeholder' && this.showButtons ? html`<d2l-button-icon text="Help" icon="tier1:help"></d2l-button-icon>` : nothing}
								</th>
							`)}
						</tr>
						${this._data.map(row => html`
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
								${columns.map(columnHeading => html`<td>${formatter.format(row.data[columnHeading.toLowerCase()])}</td>`)}
							</tr>
						`)}
						${this.showButtons ? html`
							<tr>
								<th scope="row" sticky>
									<d2l-input-checkbox></d2l-input-checkbox>
								</th>
								<td><d2l-input-text label="Enter data" label-hidden></d2l-input-text></td>
								<td><d2l-input-text label="Enter data" label-hidden></d2l-input-text></td>
								<td><d2l-input-text label="Enter data" label-hidden></d2l-input-text></td>
								<td><d2l-input-text label="Enter data" label-hidden></d2l-input-text></td>
							</tr>
						` : nothing}
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

	_handlePagerLoadMore(e) {
		const startIndex = this._data.length + 1;
		for (let i = 0; i < e.target.pageSize; i++) {
			this._data.push({ name: `City ${startIndex + i}, Country ${startIndex + i}`, data: { 'city': `City ${startIndex + i}`, 'country': `Country ${startIndex + i}`, 'population': 26320000, 'size': 6340, 'elevation': 4 }, selected: false });
		}
		this.requestUpdate();
		e.detail.complete();
	}

	_handleSort(e) {
		const field = e.target.innerText.toLowerCase();
		const desc = e.target.hasAttribute('desc');
		this._sortDesc = field === this._sortField ? !desc : false; // if sorting on same field then reverse, otherwise sort ascending
		this._sortField = field;
		this._handleSortData();
	}

	_handleSortComplex(e) {
		this._sortField = e.target?.getAttribute('data-field');
		this._sortDesc = e.target?.hasAttribute('data-desc');
		this._handleSortData();
	}

	_handleSortData() {
		this._data = this._data.sort((a, b) => {
			if (this._sortDesc) {
				if (a.data[this._sortField] > b.data[this._sortField]) return -1;
				if (a.data[this._sortField] < b.data[this._sortField]) return 1;
			} else {
				if (a.data[this._sortField] < b.data[this._sortField]) return -1;
				if (a.data[this._sortField] > b.data[this._sortField]) return 1;
			}
			return 0;
		});
	}

	_renderDoubleSortButton(name) {
		const noSort = this._sortField?.toLowerCase() !== 'city' && this._sortField?.toLowerCase() !== 'country';
		return html`
			<th scope="col">
				<d2l-table-col-sort-button
					?desc="${this._sortDesc}"
					?nosort="${noSort}">${name}
					<d2l-menu-item-radio slot="items" text="City, A to Z" data-field="city" @d2l-menu-item-select="${this._handleSortComplex}" value="1"></d2l-menu-item-radio>
					<d2l-menu-item-radio slot="items" text="City, Z to A" data-field="city" data-desc @d2l-menu-item-select="${this._handleSortComplex}" value="2"></d2l-menu-item-radio>
					<d2l-menu-item-radio slot="items" text="Country, A to Z" data-field="country" @d2l-menu-item-select="${this._handleSortComplex}" value="3"></d2l-menu-item-radio>
					<d2l-menu-item-radio slot="items" text="Country, Z to A" data-field="country" data-desc @d2l-menu-item-select="${this._handleSortComplex}" value="4"></d2l-menu-item-radio>
				</d2l-table-col-sort-button>
			</th>
		`;
	}

	_renderSortButton(item) {
		const noSort = this._sortField !== item.toLowerCase();
		return html`
			<th scope="col">
				<d2l-table-col-sort-button
					@click="${this._handleSort}"
					data-type="numbers"
					?desc="${this._sortDesc}"
					?nosort="${noSort}">${item}</d2l-table-col-sort-button>
				${item === 'Size' && this.showButtons ? html`<d2l-button-icon text="Help" icon="tier1:help"></d2l-button-icon>` : nothing}
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
