import '../button/button-icon.js';
import '../loading-spinner/loading-spinner.js';
import { AsyncContainerMixin, asyncStates } from '../../mixins/async-container/async-container-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

/**
 * The "d2l-dialog" element is a generic dialog that provides a slot for arbitrary content, and a "footer" slot for workflow buttons. Apply the "data-dialog-action" attribute to workflow buttons to automatically close the dialog with the action value.
 * @slot - Default slot for content inside dialog
 * @slot footer - Slot for footer content such as workflow buttons
 * @fires d2l-dialog-open - Dispatched when the dialog is opened
 * @fires d2l-dialog-close - Dispatched with the action value when the dialog is closed for any reason
 */
class Dialog extends LocalizeCoreElement(AsyncContainerMixin(DialogMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Whether to render a loading-spinner and wait for state changes via AsyncContainerMixin
			 */
			async: { type: Boolean },

			/**
			 * The preferred width (unit-less) for the dialog
			 */
			width: { type: Number }
		};
	}

	static get styles() {
		return [ dialogStyles, heading3Styles, css`

			.d2l-dialog-header {
				padding-bottom: 15px;
			}

			.d2l-dialog-header > div > d2l-button-icon {
				flex: none;
				margin: -4px -15px 0 15px;
			}

			:host([dir="rtl"]) .d2l-dialog-header > div > d2l-button-icon {
				margin-left: -15px;
				margin-right: 15px;
			}

			.d2l-dialog-content > div {
				/* required to properly calculate preferred height when there are bottom
				margins at the end of the slotted content */
				border-bottom: 1px solid transparent;
			}

			.d2l-dialog-content-loading {
				text-align: center;
			}

			@media (max-width: 615px) {

				.d2l-dialog-outer {
					height: calc(100% - 42px) !important;
					top: 42px;
					width: 100% !important;
				}

				div[nested].d2l-dialog-outer {
					top: 0;
				}

				.d2l-dialog-header > div > d2l-button-icon {
					margin: -8px -13px 0 15px;
				}

				:host([dir="rtl"]) .d2l-dialog-header > div > d2l-button-icon {
					margin-left: -13px;
					margin-right: 15px;
				}

			}

		`];
	}

	constructor() {
		super();
		this.async = false;
		this.width = 600;
	}

	render() {

		let loading = null;
		const slotStyles = {};
		if (this.async && this.asyncState !== asyncStates.complete) {
			slotStyles.display = 'none';
			loading = html`
				<div class="d2l-dialog-content-loading">
					<d2l-loading-spinner size="100"></d2l-loading-spinner>
				</div>
			`;
		}

		const content = html`
			${loading}
			<div style=${styleMap(slotStyles)}><slot></slot></div>
		`;

		if (!this._titleId) this._titleId = getUniqueId();
		const inner = html`
			<div class="d2l-dialog-inner">
				<div class="d2l-dialog-header">
					<div>
						<h2 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h2>
						<d2l-button-icon icon="d2l-tier1:close-small" text="${this.localize('components.dialog.close')}" @click="${this._abort}"></d2l-button-icon>
					</div>
				</div>
				<div class="d2l-dialog-content">${content}</div>
				<div class="d2l-dialog-footer">
					<slot name="footer"></slot>
				</div>
			</div>
		`;
		return this._render(
			inner,
			{ labelId: this._titleId, role: 'dialog' }
		);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('asyncState')) return;
		if (this.asyncState === asyncStates.complete) {
			this.resize();
		}
	}

	asyncContainer() {
		return this.shadowRoot.querySelector('.d2l-dialog-content');
	}

	_abort() {
		this._close('abort');
	}

}

customElements.define('d2l-dialog', Dialog);
