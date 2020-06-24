import '../icons/icon.js';
import '../link/link.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class Breadcrumb extends RtlMixin(LitElement) {

	static get properties() {
		return {
			_compact: {
				type: Boolean,
				reflect: true
			},
			href: {
				type: String,
				reflect: true
			},
			target: {
				type: String,
				reflect: true
			},
			text: {
				type: String,
				reflect: true
			},
			ariaLabel: {
				attribute: 'aria-label',
				type: String,
				reflect: true
			}
		};
	}

	static get styles() {
		return css`
			:host {
				align-items: center;
				display: inline-flex;
			}

			.d2l-breadcrumb-wrapper[data-compact] {
				display: flex;
				flex-direction: row-reverse;
				align-items: center;
			}

			d2l-icon {
				height: 8px;
				padding-left: 10px;
				padding-right: 5px;
				width: 8px;
			}

			:host([dir="rtl"]) d2l-icon {
				padding-left: 5px;
				padding-right: 10px;
			}

			.d2l-breadcrumb-wrapper[data-compact] d2l-icon {
				padding-right: 10px;
				padding-left: 0;
			}

			:host([dir="rtl"]) .d2l-breadcrumb-wrapper[data-compact] d2l-icon {
				padding-right: 0;
				padding-left: 10px;
			}
		`;
	}

	constructor() {
		super();
		this.href = '#';
		this._compact = false;
		this.text = '';
	}

	firstUpdated() {
		const event = new CustomEvent(
			'd2l-breadcrumb-connected', {
				bubbles: true,
				composed: true,
				detail: { }
			}
		);
		this.dispatchEvent(event);
		this._compact = !!event.detail.compact;
	}

	render() {
		return html`
			<div class="d2l-breadcrumb-wrapper" ?data-compact=${this._compact} role="navigation" aria-label="${this.ariaLabel ? this.ariaLabel : this.text}">
				<d2l-link href="${this.href}" target="${ifDefined(this.target)}">${this.text}</d2l-link>
				${this._compact ? html`<d2l-icon icon="d2l-tier1:chevron-left"></d2l-icon>` : html`<d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon>`}
			</div>
		`;
	}

}
customElements.define('d2l-breadcrumb', Breadcrumb);
