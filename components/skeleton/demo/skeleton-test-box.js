import '../../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestBox extends SkeletonMixin(LitElement) {

	static get styles() {
		return [
			super.styles,
			css`
				:host {
					display: block;
				}
				.d2l-demo-box {
					background-color: var(--d2l-color-fluorite-plus-2);
					border: 1px solid var(--d2l-color-fluorite);
					border-radius: 4px;
					color: var(--d2l-color-fluorite);
					height: 100px;
					padding: 10px;
					width: 300px;
				}
			`
		];
	}

	render() {
		return html`
			<div class="d2l-demo-box d2l-skeletize">Bordered Box</div>
		`;
	}
}

customElements.define('d2l-test-skeleton-box', SkeletonTestBox);
