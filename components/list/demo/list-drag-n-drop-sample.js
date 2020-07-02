import '../list-item-content.js';
import './list-item-sample.js';
import '../list.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { repeat } from 'lit-html/directives/repeat';

class listDragNDropSample extends LitElement {
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
				name: 'Introductory Earth Sciences',
				secondary: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
				img: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg'
			},
			{
				key: '5',
				name: 'Introductory Earth Sciences',
				secondary: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
				img: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg'
			},
			{
				key: '6',
				name: 'Introductory Earth Sciences',
				secondary: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
				img: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg'
			}
		];
	}

	render() {
		return html`
			<d2l-list>
				${repeat(this.list, (item) => item.key, (item) => html`
					<d2l-list-item-sample key="${item.key}" draggable @d2l-list-item-position="${this._moveItems}">
						<img slot="illustration" src="${item.img}"></img>
						<d2l-list-item-content>
							<div>${item.name}</div>
							<div slot="secondary">${item.secondary}</div>
						</d2l-list-item-content>
					</d2l-list-item-sample>
				`)}
			</d2l-list>
		`;
	}

	_moveItems(e) {
		e.detail.reorder(this.list, { keyFn: (item) => item.key });
		this.requestUpdate('list', []);
	}
}

customElements.define('d2l-list-drag-n-drop-sample', listDragNDropSample);
