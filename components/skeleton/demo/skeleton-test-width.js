import { css, html, LitElement } from 'lit-element/lit-element.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestWidth extends SkeletonMixin(LitElement) {

	static get styles() {
		return [
			super.styles,
			css`:host { display: block; }`
		];
	}

	render() {
		const sizes = [...Array(19).keys()].map(i => (i + 1) * 5);
		return sizes.map(s => html`<p class="d2l-skeletize d2l-skeletize-${s}">${s}&#37;</p>`);
	}

}

customElements.define('d2l-test-skeleton-width', SkeletonTestWidth);
