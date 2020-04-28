import { css, html, LitElement } from 'lit-element/lit-element.js';
import { skeletonStyles } from './skeleton-styles.js';

class Skeleton extends LitElement {

	static get styles() {
		return [
			skeletonStyles,
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none !important;
				}
				div.d2l-skeleton {
					height: 100%;
					width: 100%;
				}
			`
		];
	}

	render() {
		return html `<div class="d2l-skeleton"></div>`;
	}
}
customElements.define('d2l-skeleton', Skeleton);
