import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading1Styles, heading2Styles, heading3Styles, heading4Styles } from '../../typography/styles.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestHeading extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			level: { type: Number },
			width: { type: Number }
		};
	}

	static get styles() {
		return [
			super.styles,
			heading1Styles,
			heading2Styles,
			heading3Styles,
			heading4Styles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	render() {
		const width = this.width !== undefined ? ` d2l-skeletize-${this.width}` : '';
		if (this.level === 1) {
			return html`<h1 class="d2l-heading-1 d2l-skeletize${width}"><slot></slot></h1>`;
		} else if (this.level === 2) {
			return html`<h2 class="d2l-heading-2 d2l-skeletize${width}"><slot></slot></h2>`;
		} else if (this.level === 3) {
			return html`<h3 class="d2l-heading-3 d2l-skeletize${width}"><slot></slot></h3>`;
		} else if (this.level === 4) {
			return html`<h4 class="d2l-heading-4 d2l-skeletize${width}"><slot></slot></h4>`;
		}
	}

}

customElements.define('d2l-test-skeleton-heading', SkeletonTestHeading);
