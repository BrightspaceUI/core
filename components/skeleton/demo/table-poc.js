import '../../paging/pager-load-more.js';
import { css, html, LitElement } from 'lit';
import { SkeletonMixin, skeletonStyles } from '../../skeleton/skeleton-mixin.js';
import { classMap } from 'lit/directives/class-map.js';
import { tableStyles } from '../../table/table-wrapper.js';

const columns = ['City', 'Country', 'Population', 'Size', 'Elevation'];
const data = [
	{ name: 'Ottawa, Canada', loaded: false, loading: true, data: { 'city': 'Ottawa', 'country': 'Canada', 'population': 994837, 'size': 2790, 'elevation': 70, 'latitude': 45.32, 'longitude': -75.71 }, selected: true },
	{ name: 'Toronto, Canada', loaded: false, loading: true, data: { 'city': 'Toronto', 'country': 'Canada', 'population': 2930000, 'size': 630, 'elevation': 76, 'latitude': 43.69, 'longitude': -79.41 }, selected: true },
	{ name: 'Sydney, Australia', loaded: false, loading: true, data: { 'city': 'Sydney', 'country': 'Australia', 'population': 5312000, 'size': 12368, 'elevation': 3, 'latitude': -33.86, 'longitude': 151.13 }, selected: false },
	{ name: 'Cairo, Egypt', loaded: false, loading: true, data: { 'city': 'Cairo', 'country': 'Egypt', 'population': 9540000, 'size': 3085, 'elevation': 23, 'latitude': 30.05, 'longitude': 31.25 }, selected: false },
	{ name: 'Moscow, Russia', loaded: false, loading: true, data: { 'city': 'Moscow', 'country': 'Russia', 'population': 12712305, 'size': 2511, 'elevation': 124, 'latitude': 55.70, 'longitude': 35.59 }, selected: false },
	{ name: 'London, England', loaded: false, loading: true, data: { 'city': 'London', 'country': 'England', 'population': 8982000, 'size': 1572, 'elevation': 11, 'latitude': 51.49, 'longitude': -0.12 }, selected: false },
	{ name: 'Tokyo, Japan', loaded: false, loading: true, data: { 'city': 'Tokyo', 'country': 'Japan', 'population': 13960000, 'size': 2194, 'elevation': 40, 'latitude': 35.68, 'longitude': 139.74 }, selected: false }
];

class TableSkeleton extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			fixed: { type: Boolean },
			_data: { state: true }
		};
	}

	static get styles() {
		return [skeletonStyles, tableStyles, css`
			:host {
				display: block;
			}
			tr[data-loading="1"]::after {
				background-color: red;
			}
		`];
	}

	constructor() {
		super();
		this.skeleton = true;
		this.fixed = false;
		this._data = data.slice(0, 3);
	}

	render() {
		return html`
			<d2l-table-wrapper type="light">
				<table class="d2l-table">
					<thead>
						<tr>
							${columns.map(name => html`<th scope="col">${name}</th>`)}
						</tr>
					</thead>
					<tbody>
						${this._data.map(row => this.#renderRow(row))}
					</tbody>
				</table>
				<d2l-pager-load-more
					slot="pager"
					?has-more="${this._data.length < data.length}"
					page-size="3"
					@d2l-pager-load-more="${this.#handlePagerLoadMore}"></d2l-pager-load-more>
			</d2l-table-wrapper>
		`;
	}

	#handleCellLoaded(e) {
		e.target.parentNode.dataset.loaded = '1';
		const rowAllLoaded = [...e.target.parentNode.parentNode.cells].every(cell => cell.dataset.loaded === '1');
		if (rowAllLoaded) {
			this._data.find(row => row.name === e.target.parentNode.parentNode.dataset.name).loaded = true;
			this.requestUpdate('_data');
		}
		const allLoaded = this._data.every(row => row.loaded);
		if (allLoaded) {
			this._data.forEach(row => row.loading = false);
			this.requestUpdate('_data');
		}
	}

	#handlePagerLoadMore(e) {
		const startIndex = this._data.length;
		if (startIndex < data.length) {
			const newData = data.slice(startIndex, startIndex + e.target.pageSize);
			this._data = this._data.concat(newData);
		}
		e.detail.complete();
	}

	#renderRow(row) {
		const classes = {
			'd2l-skeletize': this.fixed && row.loading
		};
		return html`
			<tr
				data-name="${row.name}"
				data-loaded="${row.loaded ? '1' : '0'}"
				data-loading="${row.loading ? '1' : '0'}">
				${columns.map(columnHeading => html`
					<td data-loaded="0" >
						<d2l-test-slow-data
							class="${classMap(classes)}"
							@d2l-test-slow-data-loaded="${this.#handleCellLoaded}"
							value="${row.data[columnHeading.toLowerCase()]}"></d2l-test-slow-data>
					</td>
				`)}
			</tr>
		`;
	}
}

customElements.define('d2l-test-table-skeleton', TableSkeleton);

class SlowData extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			value: { type: String }
		};
	}

	static get styles() {
		return [skeletonStyles, css`
			:host {
				display: block;
			}
		`];
	}

	constructor() {
		super();
		this.delay = Math.floor(Math.random() * 2000) + 1000;
		this.skeleton = true;
	}

	connectedCallback() {
		super.connectedCallback();
		setTimeout(() => {
			this.skeleton = false;
			this.dispatchEvent(new CustomEvent('d2l-test-slow-data-loaded', { bubbles: false, composed: false }));
		}, this.delay);
	}

	render() {
		return html`<div class="d2l-skeletize">${this.value}</div>`;
	}

}
customElements.define('d2l-test-slow-data', SlowData);
