import '../../button/button.js';
import '../../list/list.js';
import '../../list/list-item.js';
import '../../list/list-item-content.js';
import '../../loading-spinner/loading-spinner.js';
import { css, html, LitElement, noChange } from 'lit';
import { guard } from 'lit/directives/guard.js';
import { LoadingCompleteMixin } from '../../../mixins/loading-complete/loading-complete-mixin.js';
import { until } from 'lit/directives/until.js';

class DialogAsyncContentUntil extends LoadingCompleteMixin(LitElement) {

	static get properties() {
		return {
			href: { type: String }
		};
	}

	static get styles() {
		return css`
			.content-button {
				padding-block: 1rem;
			}
			.d2l-dialog-content-loading {
				text-align: center;
			}
		`;
	}

	constructor() {
		super();
		this.href = null;
	}

	render() {
		const loadingSpinner = html`
			<div class="d2l-dialog-content-loading">
				<d2l-loading-spinner size="100"></d2l-loading-spinner>
			</div>
		`;
		return html`${guard([this.href], () => until(this._getContent(this.href), loadingSpinner, noChange))}`;
	}

	_getContent(href) {
		return new Promise((resolve) => {
			if (!href) return;
			setTimeout(() => {
				resolve(html`
					<d2l-button class="content-button">Focus on me!</d2l-button>
					<d2l-list>
						<d2l-list-item>
							<img slot="illustration" src="https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg" @load="${this.#handleImageLoad}">
							<d2l-list-item-content>
								<div>Introductory Earth Sciences</div>
								<div slot="supporting-info">This course explores the geological process of the Earth's interior and surface. These include volcanism, earthquakes, mountains...</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item>
							<img slot="illustration" src="https://s.brightspace.com/course-images/images/e5fd575a-bc14-4a80-89e1-46f349a76178/tile-high-density-max-size.jpg" @load="${this.#handleImageLoad}">
							<d2l-list-item-content>
								<div>Engineering Materials for Energy Systems</div>
								<div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain...</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item>
							<img slot="illustration" src="https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg" @load="${this.#handleImageLoad}">
							<d2l-list-item-content>
								<div>Geomorphology and GIS </div>
								<div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain...</div>
							</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
					`);
			}, 1000);
		});
	}

	#handleImageLoad() {
		const images = this.shadowRoot.querySelectorAll('img');
		for (const image of images) {
			if (!image.complete) return;
		}
		this.shadowRoot.querySelector('.content-button').focus();
		this.resolveLoadingComplete();
	}

}

customElements.define('d2l-dialog-demo-async-content-until', DialogAsyncContentUntil);
