import './primary-secondary-layout.js';
import '../../components/form/form.js';
import '../../components/form/form-error-summary.js';
import { css, html, LitElement, nothing } from 'lit';

/**
 * A two panel (primary and secondary) page template with header and optional footer
 * @slot header - Page header content
 * @slot footer - Page footer content
 * @slot primary - Main page content
 * @slot secondary - Supplementary page content
 * @fires d2l-iframe-pointer-events-disable - Dispatched when a user begins moving the divider to instruct iframe owners to disable pointer events.
 * @fires d2l-iframe-pointer-events-enable - Dispatched when a user finishes moving the divider to instruct iframe owners to re-enable pointer events.
 * @fires d2l-template-primary-secondary-form-invalid Dispatched when the form fails validation. The error map can be obtained from the detail's errors property.
 * @fires d2l-template-primary-secondary-form-dirty Dispatched whenever any form element fires an input or change event. Can be used to track whether the form is dirty or not.
 * @fires d2l-template-primary-secondary-form-submit Dispatched when the form is submitted. The form data can be obtained from the detail's formData property.
 */
class TemplatePrimarySecondary extends LitElement {

	static get properties() {
		return {
			/**
			 * Controls whether the primary and secondary panels have shaded backgrounds
			 * @type {'primary'|'secondary'|'none'}
			 */
			backgroundShading: { type: String, attribute: 'background-shading' },
			/**
			 * Controls how the primary panel's contents overflow
			 * @type {'default'|'hidden'}
			 */
			primaryOverflow: { attribute: 'primary-overflow', reflect: true, type: String },
			/**
			 * Whether the panels are user resizable. This only applies to desktop users,
			 * mobile users will always be able to resize.
			 * @type {boolean}
			 */
			resizable: { type: Boolean, reflect: true },
			/**
			 * When set to true, the secondary panel will be displayed on the left (or the
			 * right in RTL) in the desktop view. This attribute has no effect on the mobile view.
			 * @type {boolean}
			 */
			secondaryFirst: { type: Boolean, attribute: 'secondary-first', reflect: true },
			/**
			 * The key used to persist the divider's position to local storage. This key
			 * should not be shared between pages so that users can save different divider
			 * positions on different pages. If no key is provided, the template will fall
			 * back its default size.
			 * @type {string}
			 */
			storageKey: { type: String, attribute: 'storage-key' },
			/**
			 * Whether content fills the screen or not
			 * @type {'fullscreen'|'normal'}
			 */
			widthType: { type: String, attribute: 'width-type', reflect: true },
			/**
			 * Whether to render an encompassing form over all panels
			 * @type {boolean}
			 */
			hasForm: { type: Boolean, attribute: 'has-form' },
			_hasFooter: { type: Boolean, attribute: false },
		};
	}

	static get styles() {
		return css`
			:host,
			:host > d2l-form {
				bottom: 0;
				left: 0;
				overflow: hidden;
				position: absolute;
				right: 0;
				top: 0;
			}

			:host([hidden]) {
				display: none;
			}

			:host([width-type="normal"]) .d2l-template-primary-secondary-footer {
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}

			.d2l-template-primary-secondary-container {
				display: flex;
				flex-direction: column;
				height: 100%;
				width: 100%;
			}

			footer {
				background-color: white;
				box-shadow: 0 -2px 4px rgba(32, 33, 34, 0.2); /* ferrite */
				padding: 0.75rem 1rem;
				z-index: 1; /* ensures the footer box-shadow is over main areas with background colours set */
			}
			header {
				z-index: 14; /* ensures the header box-shadow is over main areas with background colours set, and opt-in on top of sticky header */
			}

			d2l-template-primary-secondary-layout {
				flex: 1;
				min-height: 0;
			}

			@media print {
				:host {
					overflow: visible;
					position: relative;
				}

				.d2l-template-primary-secondary-container > footer {
					box-shadow: none;
					padding: 0;
				}

				.d2l-template-primary-secondary-container {
					height: auto;
				}
			}
		`;
	}

	constructor() {
		super();
		this.backgroundShading = 'none';
		this.resizable = false;
		this.secondaryFirst = false;
		this.widthType = 'fullscreen';
		this.hasForm = false;
	}

	get form() {
		return this.shadowRoot.querySelector('d2l-form');
	}

	render() {
		const content = html`
			<div class="d2l-template-primary-secondary-container">
				<header><slot name="header"></slot></header>
				<d2l-template-primary-secondary-layout
					background-shading="${this.backgroundShading}"
					?resizable="${this.resizable}"
					?secondary-first="${this.secondaryFirst}"
					width-type="${this.widthType}"
					primary-overflow="${this.primaryOverflow ?? 'default'}"
					storage-key="${this.storageKey ?? ''}">
					${this.hasForm ? html`<d2l-form-error-summary _has-top-margin id="form-error-summary" slot="primary"></d2l-form-error-summary>` : nothing}
					<slot name="primary" slot="primary"></slot>
					<slot name="secondary" slot="secondary"></slot>
				</d2l-template-primary-secondary-layout>
				<footer ?hidden="${!this._hasFooter}">
					<div class="d2l-template-primary-secondary-footer"><slot name="footer" @slotchange="${this._handleFooterSlotChange}"></slot></div>
				</footer>
			</div>
		`;

		if (this.hasForm) return html`<d2l-form
			summary-id="form-error-summary"
			@d2l-form-invalid=${this.#handleInvalidForm}
			@d2l-form-submit=${this.#handleFormSubmit}
			@d2l-form-dirty=${this.#handleFormDirty}>
			${content}
		</d2l-form>`;
		return content;
	}

	submitForm() {
		this.form.submit();
	}

	_handleFooterSlotChange(e) {
		const nodes = e.target.assignedNodes();
		this._hasFooter = (nodes.length !== 0);
	}

	#handleFormDirty(e) {
		this.dispatchEvent(new CustomEvent('d2l-template-primary-secondary-form-dirty', { detail: e.detail }));
	}

	#handleFormSubmit(e) {
		this.dispatchEvent(new CustomEvent('d2l-template-primary-secondary-form-submit', { detail: e.detail }));
	}

	#handleInvalidForm(e) {
		this.dispatchEvent(new CustomEvent('d2l-template-primary-secondary-form-invalid', { detail: e.detail }));
	}
}

customElements.define('d2l-template-primary-secondary', TemplatePrimarySecondary);
