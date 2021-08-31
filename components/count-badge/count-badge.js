import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class CountBadge extends RtlMixin(LitElement) {

	static get properties() {
		return {
			number: {
				type: Number,
				reflect: true,
				attribute: 'number'
			}
		};
	}

	static get styles() {
		return [ css`
		.d2l-count-badge-number {
			color: white;
			font-size: 0.6rem;
			font-weight: bold;
			line-height: 0.9rem;
			padding-left: 0.3rem;
			padding-right: 0.3rem;
		}

		.d2l-count-badge-background {
			background: var(--d2l-color-carnelian-minus-1);
			border: 2px white;
			border-radius: 0.45rem;
			display: inline-block;
			min-width: 0.9rem;
		}
		`];
	}

	constructor() {
		super();
		this.number = null;
	}

	render() {
		return html`
		<div class="d2l-count-badge-background">
        	<div class="d2l-count-badge-number">
				${this.number}
			</div>
		<div>`;
	}
}

customElements.define('d2l-count-badge', CountBadge);
