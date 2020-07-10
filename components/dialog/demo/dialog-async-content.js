import '../../list/list.js';
import '../../list/list-item.js';
import '../../list/list-item-content.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { InitialStateError, runAsync } from '../../../directives/run-async.js';

class DialogAsyncContent extends LitElement {

	static get properties() {
		return {
			href: { type: String }
		};
	}

	constructor() {
		super();
		this.href = null;
	}

	render() {
		return html`${runAsync(this.href, (href) => this._getContent(href), {
			success: (content) => content
		})}`;
	}

	_getContent(href) {
		return new Promise((resolve) => {
			if (!href) {
				throw new InitialStateError();
			}
			setTimeout(() => {
				resolve(html`
					<d2l-list>
						<d2l-list-item>
							<img slot="illustration" src="https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg"></img>
							<d2l-list-item-content>
								<div>Introductory Earth Sciences</div>
								<div slot="supporting-info">This course explores the geological process of the Earth's interior and surface. These include volcanism, earthquakes, mountains...</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item>
							<img slot="illustration" src="https://s.brightspace.com/course-images/images/e5fd575a-bc14-4a80-89e1-46f349a76178/tile-high-density-max-size.jpg"></img>
							<d2l-list-item-content>
								<div>Engineering Materials for Energy Systems</div>
								<div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain...</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item>
							<img slot="illustration" src="https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg"></img>
							<d2l-list-item-content>
								<div>Geomorphology and GIS </div>
								<div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain...</div>
							</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
					`);
			}, 5000);
		});
	}

}

customElements.define('d2l-dialog-demo-async-content', DialogAsyncContent);
