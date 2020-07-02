import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * An entry within a <d2l-breadcrumbs> parent representing the current page.
 */
class BreadcrumbCurrentPage extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			_role: { type: 'string', attribute: 'role', reflect: true },
			/**
			 * REQUIRED: The title of the current page
			 */
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				align-items: center;
				display: inline-flex;
				font-size: 0.7rem;
				line-height: 1.05rem;
				letter-spacing: 0.01rem;
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
		`;
	}

	constructor() {
		super();
		this._role = 'listitem';
	}

	render() {
		return html`<span aria-current="page">${this.text}</span><d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon>`;
	}

}
customElements.define('d2l-breadcrumb-current-page', BreadcrumbCurrentPage);
