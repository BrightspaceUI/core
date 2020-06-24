import './breadcrumb.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class BreadCrumbs extends RtlMixin(LitElement) {
	static get properties() {
		return {
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

			:host([compact]) .d2l-breadcrumbs-wrapper ::slotted(d2l-breadcrumb:not(:last-of-type)) {
				display:none;
			}
		`;
	}

	constructor() {
		super();
		this.compact = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-breadcrumb-connected', this._handleBreadCrumbConnected, true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-breadcrumb-connected', this._handleBreadCrumbConnected, true);
	}

	render() {
		return html`
			<div class="d2l-breadcrumbs-wrapper">
				<slot></slot>
			</div>
		`;
	}

	_handleBreadCrumbConnected(e) {
		e.detail.compact = this.compact;
	}

}
customElements.define('d2l-breadcrumbs', BreadCrumbs);
