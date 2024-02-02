import './breadcrumb.js';
import { css, html, LitElement } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * Help users understand where they are within the application, and provide useful clues about how the space is organized. They also provide a convenient navigation mechanism.
 * @slot - Breadcrumb items
 */
class Breadcrumbs extends LocalizeCoreElement(RtlMixin(LitElement)) {
	static get properties() {
		return {
			/**
			 * Renders in compact mode, displaying only the last item
			 * @type {boolean}
			 */
			compact: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				font-size: 0.7rem;
				line-height: 1.05rem;
				overflow: hidden;
				position: relative;
				white-space: nowrap;
			}
			:host([hidden]) {
				display: none;
			}

			:host::after {
				background: linear-gradient(to right, rgba(255, 255, 255, 0), rgb(251, 252, 252));
				bottom: 0;
				content: "";
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

			:host([compact]) ::slotted(d2l-breadcrumb:not(:last-of-type)),
			:host([compact]) ::slotted(d2l-breadcrumb-current-page) {
				display: none;
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
