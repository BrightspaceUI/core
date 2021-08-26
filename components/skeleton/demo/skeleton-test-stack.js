import '../../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestStack extends SkeletonMixin(LitElement) {

	static get styles() {
		return [
			super.styles,
			css`
				:host {
					display: block;
				}
				.d2l-demo-stack {
					height: 100px;
					width: 300px;
				}
				#stack-2 {
					bottom: 0;
					line-height: 1em;
					margin: -0.5em;
					position: absolute;
					width: 100%;
					z-index: 500;
				}
			`
		];
	}

	render() {
		return html`
			<div class="d2l-demo-stack d2l-skeletize">Stack 2: 999</div>
			<div id="stack-2">Stack 2: 500</div>
		`;
	}
}

customElements.define('d2l-test-skeleton-stack', SkeletonTestStack);
