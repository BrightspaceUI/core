import './breadcrumb.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component to help users understand where they are within the LMS. would be used the parent of d2l-breadcrumb and will render them in a slot
 */
class Breadcrumbs extends LocalizeCoreElement(RtlMixin(LitElement)) {
	static get properties() {
		return {
			/**
			 * indicates whether the breadcrumbs are redenred in compact mode (which means it will only display the last time and also includes some visual differences)
			 */
			compact: {
				type: Boolean,
				reflect: true
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				position: relative;
			}

			:host([hidden]) {
				display: none;
			}

			:host::after {
				background: linear-gradient(to right, rgba(255, 255, 255, 0), rgb(251, 252, 252));
				bottom: 0;
				content: '';
				pointer-events: none;
				position: absolute;
				right: 0;
				top: 0;
				width: 10px;
			}

			:host([dir="rtl"])::after {
				background: linear-gradient(to left, rgba(255, 255, 255, 0), rgb(251, 252, 252));
				left: 0;
				right: auto;
			}

			nav {
				overflow: hidden;
				position: relative;
				white-space: nowrap;
			}

			:host([compact]) ::slotted(d2l-breadcrumb:not(:last-of-type)) {
				display:none;
			}
		`;
	}

	constructor() {
		super();
		this.compact = false;
	}

	render() {
		return html`
			<nav aria-label="${this.localize('components.breadcrumbs.breadcrumb')}">
				<div role="list">
					<slot></slot>
				</div>
			</nav>
		`;
	}

}
customElements.define('d2l-breadcrumbs', Breadcrumbs);
