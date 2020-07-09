import '../list-item-content.js';
import './list-demo-item-sample.js';
import '../list.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { repeat } from 'lit-html/directives/repeat';

class ListDemoDragNDropUsage extends LitElement {
	static get properties() {
		return {
			list: { type: Array }
		};
	}

	constructor() {
		super();
		this.list = [
			{
				key: '1',
				name: 'Geomorphology and GIS',
				secondary: 'This course explores the geological processes of the Earth\'s interior and surface. These include volcanism, earthquakes, mountain...',
				img: 'https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg'
			},
			{
				key: '2',
				name: 'Engineering Materials for Energy Systems',
				secondary: 'This course explores the geological processes of the Earth\'s interior and surface. These include volcanism, earthquakes, mountain...',
				img: 'https://s.brightspace.com/course-images/images/e5fd575a-bc14-4a80-89e1-46f349a76178/tile-high-density-max-size.jpg'
			},
			{
				key: '3',
				name: 'Introductory Earth Sciences',
				secondary: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
				img: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg'
			},
			{
				key: '4',
				name: 'Applied Complex Analysis',
				secondary: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
				img: 'https://s.brightspace.com/course-images/images/c63e7407-c3ba-4fa0-8383-08a8f4fa468b/tile-high-density-max-size.jpg'
			},
			{
				key: '5',
				name: 'Basic French',
				secondary: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
				img: 'https://s.brightspace.com/course-images/images/9e319eb4-31af-4912-889d-92d9f2d82884/tile-high-density-max-size.jpg'
			},
			{
				key: '6',
				name: 'Algebraic Number Theory',
				secondary: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
				img: 'https://s.brightspace.com/course-images/images/36c5813d-2ac3-4a73-8f39-3d6e1b381fe3/tile-high-density-max-size.jpg'
			}
		];
	}

	render() {
		return html`
			<d2l-list>
				${repeat(this.list, (item) => item.key, (item) => html`
					<d2l-list-demo-item-sample key="${ifDefined(item.key)}" draggable @d2l-list-item-position-change="${this._moveItems}">
						<img slot="illustration" src="${item.img}"></img>
						<d2l-list-item-content>
							<div>${item.name}</div>
							<div slot="secondary">${item.secondary}</div>
						</d2l-list-item-content>
					</d2l-list-demo-item-sample>
				`)}
			</d2l-list>
		`;
	}

	_moveItems(e) {
		e.detail.reorder(this.list, { keyFn: (item) => item.key });
		this.requestUpdate('list', []);
	}
}

customElements.define('d2l-list-demo-drag-n-drop-usage', ListDemoDragNDropUsage);
