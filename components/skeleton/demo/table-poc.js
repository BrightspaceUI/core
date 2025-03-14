import '../../paging/pager-load-more.js';
import { css, html, LitElement } from 'lit';
import { tableStyles } from '../../table/table-wrapper.js';

const columns = ['City', 'Country', 'Population', 'Size', 'Elevation'];
const data = [
	{ name: 'Ottawa, Canada', data: { 'city': 'Ottawa', 'country': 'Canada', 'population': 994837, 'size': 2790, 'elevation': 70, 'latitude': 45.32, 'longitude': -75.71 }, selected: true },
	{ name: 'Toronto, Canada', data: { 'city': 'Toronto', 'country': 'Canada', 'population': 2930000, 'size': 630, 'elevation': 76, 'latitude': 43.69, 'longitude': -79.41 }, selected: true },
	{ name: 'Sydney, Australia', data: { 'city': 'Sydney', 'country': 'Australia', 'population': 5312000, 'size': 12368, 'elevation': 3, 'latitude': -33.86, 'longitude': 151.13 }, selected: false },
	{ name: 'Cairo, Egypt', data: { 'city': 'Cairo', 'country': 'Egypt', 'population': 9540000, 'size': 3085, 'elevation': 23, 'latitude': 30.05, 'longitude': 31.25 }, selected: false },
	{ name: 'Moscow, Russia', data: { 'city': 'Moscow', 'country': 'Russia', 'population': 12712305, 'size': 2511, 'elevation': 124, 'latitude': 55.70, 'longitude': 35.59 }, selected: false },
	{ name: 'London, England', data: { 'city': 'London', 'country': 'England', 'population': 8982000, 'size': 1572, 'elevation': 11, 'latitude': 51.49, 'longitude': -0.12 }, selected: false },
	{ name: 'Tokyo, Japan', data: { 'city': 'Tokyo', 'country': 'Japan', 'population': 13960000, 'size': 2194, 'elevation': 40, 'latitude': 35.68, 'longitude': 139.74 }, selected: false }
];

class TableSkeleton extends LitElement {

	static get properties() {
		return {
			_data: { state: true }
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
						${this._data.map(row => html`
							<tr>
								${columns.map(columnHeading => html`
									<td>
										<d2l-test-slow-data value="${row.data[columnHeading.toLowerCase()]}"></d2l-test-slow-data>
									</td>
								`)}
							</tr>
						`)}
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

	#handlePagerLoadMore(e) {
		const startIndex = this._data.length;
		if (startIndex < data.length) {
			const newData = data.slice(startIndex, startIndex + e.target.pageSize);
			this._data = this._data.concat(newData);
		}
		e.detail.complete();
	}
}

customElements.define('d2l-test-table-skeleton', TableSkeleton);

class SlowData extends LitElement {

	static get properties() {
		return {
			value: { type: String },
			_loaded: { state: true }
		};
	}

	constructor() {
		super();
		this.delay = Math.floor(Math.random() * 2000) + 1000;
		this._loaded = false;
	}

	connectedCallback() {
		super.connectedCallback();
		setTimeout(() => this._loaded = true, this.delay);
	}

	render() {
		return this._loaded ? this.value : 'Loading...';
	}

}
customElements.define('d2l-test-slow-data', SlowData);
