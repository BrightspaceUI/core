import './breadcrumb.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component to help users understand where they are within the LMS. would be used the parent of d2l-breadcrumb and will render them in a slot
 */
class BreadCrumbs extends RtlMixin(LitElement) {
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

			.d2l-breadcrumbs-wrapper {
				overflow: hidden;
				position: relative;
				white-space: nowrap;
			}

			.d2l-breadcrumbs-wrapper ol {
				list-style: none;
				margin: 0;
				padding: 0;
			}

			:host([compact]) .d2l-breadcrumbs-wrapper ::slotted(d2l-breadcrumb:not(:last-of-type)) {
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
			<nav aria-label="Breadcrumb" class="d2l-breadcrumbs-wrapper" @d2l-breadcrumb-connected="${this._handleBreadCrumbConnected}">
				<ol>
					<slot></slot>
				</ol>
			</nav>
		`;
	}

	_handleBreadCrumbConnected(e) {
		e.detail.compact = this.compact;
	}

}
customElements.define('d2l-breadcrumbs', BreadCrumbs);
