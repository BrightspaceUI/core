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

const dataColumns = ['Population', 'Size', 'Elevation'];
const thTextShort = ['Additional', 'Placeholder', 'Header'];

const data = () => [
	{ name: 'Ottawa, Canada', data: { 'population': 356863, 'size': 567233, 'elevation': 789 }, selected: true },
	{ name: 'Sydney, Australia', data: { 'population': 308298, 'size': 398610, 'elevation': 351 }, selected: true },
	{ name: 'Cairo, Egypt', data: { 'population': 716931, 'size': 4603253, 'elevation': 238 }, selected: false },
	{ name: 'Moscow, Russia', data: { 'population': 1300000, 'size': 50000, 'elevation': 649 }, selected: false },
	{ name: 'London, England', data: { 'population': 345782, 'size': 589763, 'elevation': 129 }, selected: false },
	{ name: 'Seattle, USA', data: { 'population': 129875, 'size': 1459, 'elevation': 123 }, selected: false },
	{ name: 'Tokyo, Japan', data: { 'population': 857834, 'size': 146788, 'elevation': 783 }, selected: false }
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
				return ifDefined(this._multifacetedField) ?
					b.data[this._sortField] - a.data[this._sortField] || b.name - a.name :
					b.data[this._sortField] - a.data[this._sortField];
			}
			return ifDefined(this._multifacetedField) ?
				a.data[this._sortField] - b.data[this._sortField] || a.name - b.name :
				a.data[this._sortField] - b.data[this._sortField];
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
							${dataColumns.map(data => this._renderSortButton(data))}
						</tr>
					</thead>
					<tbody>
						<tr class="d2l-table-header">
							<th scope="col" sticky></th>
							${this._renderDoubleSortButton('City', 'Country')}
							${thTextShort.map(text => html`<th scope="col">${text}</th>`)}
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
								${dataColumns.map(data => html`<td>${formatter.format(row.data[data.toLowerCase()])}</td>`)}
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
			this._multifacetedField = undefined;
			this._sortDesc = !desc;
		}
	}

	_handleMultifacetedAtoZ(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');

		if (sortButtonComponent) {
			const field = sortButtonComponent.innerText.toLowerCase();
			const desc = false;
			this._sortField = field;
			this._multifacetedField = false;
			this._sortDesc = !desc;
		}
	}

	_handleMultifacetedZtoA(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');

		if (sortButtonComponent) {
			const field = sortButtonComponent.innerText.toLowerCase();
			const desc = true;
			this._sortField = field;
			this._multifacetedField = true;
			this._sortDesc = !desc;
		}
	}

	_handlePagerLoadMore(e) {
		const startIndex = this._data.length + 1;
		for (let i = 0; i < e.target.pageSize; i++) {
			this._data.push({ name: `City, Country ${startIndex + i}`, data: { 'population': 8534, 'size': 1325, 'elevation': 78382756 }, selected: false });
		}
		this.requestUpdate();
		e.detail.complete();
	}

	_handleSort(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');
		const field = sortButtonComponent.innerText.toLowerCase();
		const desc = e.target.hasAttribute('desc');
		this._sortField = field;
		this._sortDesc = !desc;
	}

	_handleSortDropdown(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');
		const field = sortButtonComponent.innerText.toLowerCase();
		this._sortField = field;
	}

	_handleZtoA(e) {
		const sortButtonComponent = e.target.closest('d2l-table-col-sort-button');

		if (sortButtonComponent) {
			const field = sortButtonComponent.innerText.toLowerCase();
			const desc = true;
			this._sortField = field;
			this._multifacetedField = undefined;
			this._sortDesc = !desc;
		}
	}

	_renderDoubleSortButton(data1, data2) {
		const noSort = this._sortField !== data1.toLowerCase();
		return html`
			<th scope="col">
				<d2l-table-col-sort-button
					@click="${this._handleSort}"
					?desc="${this._sortDesc}"
					?nosort="${noSort}">${data1}
				</d2l-table-col-sort-button>
				<d2l-table-col-sort-button nosort>
					${data2}
				</d2l-table-col-sort-button>
			</th>
		`;
	}

	_renderSortButton(data) {
		const noSort = this._sortField !== data.toLowerCase();
		const ariaButtonLabel = 'Data';
		const ariaScreenReaderSyntax = 'menu pop-up button';
		const ariaScreenReaderSyntaxMainButton = 'button';
		const ariaLabelDescriptionMainButton = 'click to add sort order';
		const ariaDescriptionLabel = 'click to change sort order';
		const sortLabels = [
			'Lowest to Highest',
			'Highest to Lowest',
			'City, Country, Lowest to Highest',
			'City, Country, Highest to Lowest'
		];
		const ariaLabels = {
			multFaceted: [
				`${ariaButtonLabel} ${ariaScreenReaderSyntax} ${ariaLabelDescriptionMainButton}`,
				`${ariaButtonLabel} ${ariaScreenReaderSyntax} Sorted ${sortLabels[0]} ${ariaDescriptionLabel}`,
				`${ariaButtonLabel} ${ariaScreenReaderSyntax} Sorted ${sortLabels[1]} ${ariaDescriptionLabel}`,
				`${ariaButtonLabel} ${ariaScreenReaderSyntax} Sorted ${sortLabels[2]} ${ariaDescriptionLabel}`,
				`${ariaButtonLabel} ${ariaScreenReaderSyntax} Sorted ${sortLabels[3]} ${ariaDescriptionLabel}`
			],
			singleFaceted: [
				`${ariaButtonLabel} ${ariaScreenReaderSyntaxMainButton} ${ariaLabelDescriptionMainButton}`,
				`${ariaButtonLabel} ${ariaScreenReaderSyntaxMainButton} Sorted ${sortLabels[0]} ${ariaDescriptionLabel}`,
				`${ariaButtonLabel} ${ariaScreenReaderSyntaxMainButton} Sorted ${sortLabels[0]} ${ariaDescriptionLabel}`,
			]
		};

		if (data === 'Size') {
			return html`
				<th class="sortableCell" scope="col">
					<d2l-table-col-sort-button
						ariaLabel="${ariaLabels.multFaceted.toString()}"
						@click="${this._handleSortDropdown}"
						?desc="${this._sortDesc}"
						?nosort="${noSort}">
						${data}
						<d2l-menu-item slot="items" text=${sortLabels[0]} @click="${this._handleAtoZ}"></d2l-menu-item>
						<d2l-menu-item slot="items" text=${sortLabels[1]} @click="${this._handleZtoA}"></d2l-menu-item>
						<d2l-menu-item slot="items" text=${sortLabels[2]} @click="${this._handleMultifacetedAtoZ}"></d2l-menu-item>
						<d2l-menu-item slot="items" text=${sortLabels[3]} @click="${this._handleMultifacetedZtoA}"></d2l-menu-item>
					</d2l-table-col-sort-button>
				</th>
			`;
		}
		return html`
			<th class="sortableCell" scope="col">
				<d2l-table-col-sort-button
					ariaLabel="${ariaLabels.singleFaceted.toString()}"
					@click="${this._handleSort}"
					?desc="${this._sortDesc}"
					?nosort="${noSort}">${data}
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
