import { css, html, LitElement } from 'lit-element/lit-element.js';
import { skeletonStyles } from '../skeleton-styles.js';

class SvgSkeleton extends LitElement {

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
				svg {
					height: 100%;
					width: 100%;
				}
			`
		];
	}

	render() {
		return html`
			<svg width="100%" height="100%">
				<rect x="0" rx="4" width="100%" y="0" ry="4" height="100%" class="d2l-skeleton"></rect>
			</svg>
		`;
	}
}

customElements.define('d2l-svg-skeleton', SvgSkeleton);
