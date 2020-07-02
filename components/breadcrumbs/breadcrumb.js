import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { linkStyles } from '../link/link.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * An entry within a <d2l-breadcrumbs> parent.
 */
class Breadcrumb extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			_compact: { attribute: 'data-compact', reflect: true, type: Boolean  },
			/**
			 * @ignore
			 */
			_role: { type: 'string', attribute: 'role', reflect: true },
			/**
			 * The Url that breadcrumb is pointing to
			 */
			href: { type: String, reflect: true },
			/**
			 * The target of breadcrumb link
			 */
			target: { type: String, reflect: true },
			/**
			 * REQUIRED: text of the breadcrumb link
			 */
			text: { type: String, reflect: true },
			/**
			 * ARIA label of the breadcrumb
			 */
			ariaLabel: { attribute: 'aria-label', type: String, reflect: true }
		};
	}

	static get styles() {
		return [linkStyles, css`
			:host {
				align-items: center;
				display: inline-flex;
			}
			:host([hidden]) {
				display: none;
			}
			:host([data-compact]) {
				flex-direction: row-reverse;
			}

			d2l-icon {
				height: 8px;
				padding-left: 8px;
				padding-right: 3px;
				width: 8px;
			}
			:host([dir="rtl"]) d2l-icon {
				padding-left: 3px;
				padding-right: 8px;
			}

			d2l-icon[icon="d2l-tier1:chevron-left"] {
				padding-right: 8px;
				padding-left: 0;
			}
			:host([dir="rtl"]) d2l-icon[icon="d2l-tier1:chevron-left"] {
				padding-right: 0;
				padding-left: 8px;
			}
		`];
	}

	constructor() {
		super();
		this._compact = false;
		this.text = '';
		this._role = 'listitem';
	}

	connectedCallback() {
		super.connectedCallback();
		findComposedAncestor(this, (node) => {
			if (node.tagName === 'D2L-BREADCRUMBS') {
				this._compact = node.hasAttribute('compact');
			}
		});
	}

	render() {
		const icon = this._compact ? 'd2l-tier1:chevron-left' : 'd2l-tier1:chevron-right';
		return html`<a class="d2l-link d2l-link-small" aria-label="${ifDefined(this.ariaLabel)}" href="${this.href}" target="${ifDefined(this.target)}">${this.text}</a><d2l-icon icon="${icon}"></d2l-icon>`;
	}

}
customElements.define('d2l-breadcrumb', Breadcrumb);
