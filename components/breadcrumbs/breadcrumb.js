import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { findComposedAncestor } from '../../helpers/dom.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { linkStyles } from '../link/link.js';

/**
 * An entry within a <d2l-breadcrumbs> parent.
 */
class Breadcrumb extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			_compact: { attribute: 'data-compact', reflect: true, type: Boolean },
			/**
			 * @ignore
			 */
			_role: { type: 'string', attribute: 'role', reflect: true },
			/**
			 * The Url that breadcrumb is pointing to
			 * @type {string}
			 */
			href: { type: String, reflect: true },
			/**
			 * The target of breadcrumb link
			 * @type {string}
			 */
			target: { type: String, reflect: true },
			/**
			 * REQUIRED: The text of the breadcrumb link
			 * @type {string}
			 */
			text: { type: String, reflect: true },
			/**
			 * ACCESSIBILITY: ARIA label for the breadcrumb, used if `text` does not provide enough context for screen reader users
			 * @type {string}
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
			.d2l-link:focus {
				outline-offset: -2px;
			}
			d2l-icon {
				height: 8px;
				padding-inline: 8px 3px;
				width: 8px;
			}
			d2l-icon[icon="tier1:chevron-left"] {
				padding-inline: 0 8px;
			}
		`];
	}

	constructor() {
		super();
		/** @ignore */
		this._compact = false;
		/** @ignore */
		this._role = 'listitem';

		this.text = '';
	}

	static get focusElementSelector() {
		return 'a';
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
		const icon = this._compact ? 'tier1:chevron-left' : 'tier1:chevron-right';
		return html`<a class="d2l-link d2l-link-small" aria-label="${ifDefined(this.ariaLabel)}" href="${this.href}" target="${ifDefined(this.target)}">${this.text}</a><d2l-icon icon="${icon}"></d2l-icon>`;
	}

}
customElements.define('d2l-breadcrumb', Breadcrumb);
