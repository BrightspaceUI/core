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

const columns = ['Population', 'Size', 'Elevation'];
const thText = ['Additional', 'Placeholder', 'Header', 'Row'];

const data = () => [
	{ name: 'Ottawa, Canada', city: 'Ottawa', country: 'Canada', data: { 'population': 994837, 'size': 2790, 'elevation': 70 }, selected: false },
	{ name: 'Toronto, Canada', city: 'Toronto', country: 'Canada', data: { 'population': 2930000, 'size': 630, 'elevation': 76 }, selected: false },
	{ name: 'Sydney, Australia', city: 'Sydney', country: 'Australia', data: { 'population': 5312000, 'size': 12368, 'elevation': 3 }, selected: false },
	{ name: 'Cairo, Egypt', city: 'Cairo', country: 'Egypt', data: { 'population': 9540000, 'size': 3085, 'elevation': 23 }, selected: false },
	{ name: 'Moscow, Russia', city: 'Moscow', country: 'Russia', data: { 'population': 12712305, 'size': 2511, 'elevation': 124 }, selected: false },
	{ name: 'London, England', city: 'London', country: 'England', data: { 'population': 8982000, 'size': 1572, 'elevation': 11 }, selected: false },
	{ name: 'New York, United States of America', city: 'New York', country: 'United States of America', data: { 'population': 8336000, 'size': 1223, 'elevation': 122 }, selected: false },
	{ name: 'Seattle, United States of America', city: 'Seattle', country: 'United States of America', data: { 'population': 749256, 'size': 368, 'elevation': 53 }, selected: false },
	{ name: 'Tokyo, Japan', city: 'Tokyo', country: 'Japan', data: { 'population': 13960000, 'size': 2194, 'elevation': 40 }, selected: false },
	{ name: 'Beijing, China', city: 'Beijing', country: 'China', data: { 'population': 21540000, 'size': 16411, 'elevation': 44 }, selected: false },
	{ name: 'Paris, France', city: 'Paris', country: 'France', data: { 'population': 2161000, 'size': 105, 'elevation': 35 }, selected: false },
	{ name: 'Mumbai, India', city: 'Mumbai', country: 'India', data: { 'population': 21673000, 'size': 603, 'elevation': 14 }, selected: false },
	{ name: 'Mexico City, Mexico', city: 'Mexico City', country: 'Mexico', data: { 'population': 8855000, 'size': 1485, 'elevation': 2240 }, selected: false }
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
		`];
	}

	constructor() {
		super();

		this.paging = false;
		this.stickyControls = false;
		this.visibleBackground = false;
		this._data = data();
		this._sortField = undefined;
		this._sortDesc = false;
	}

	render() {
		const sorted = this._data.sort((a, b) => {
			if (this._sortDesc) {
				return b.data[this._sortField] - a.data[this._sortField];
			}
			return a.data[this._sortField] - b.data[this._sortField];
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
							<th scope="col">City, Country</th>
							${columns.map(columnHeading => this._renderSortButton(columnHeading))}
						</tr>
					</thead>
					<tbody>
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
								${columns.map(columnHeading => html`<td>${formatter.format(row.data[columnHeading.toLowerCase()])}</td>`)}
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

	_handlePagerLoadMore(e) {
		const startIndex = this._data.length + 1;
		for (let i = 0; i < e.target.pageSize; i++) {
			this._data.push({ name: `Country ${startIndex + i}`, data: { 'population': 26320000, 'size': 6340, 'elevation': 4 }, selected: false });
		}
		this.requestUpdate();
		e.detail.complete();
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
