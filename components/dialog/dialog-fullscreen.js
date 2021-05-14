import '../button/button-icon.js';
import '../loading-spinner/loading-spinner.js';
import { AsyncContainerMixin, asyncStates } from '../../mixins/async-container/async-container-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

/**
 * A generic fullscreen dialog that provides a slot for arbitrary content and a "footer" slot for workflow buttons. Apply the "data-dialog-action" attribute to workflow buttons to automatically close the dialog with the action value.
 * @slot - Default slot for content inside dialog
 * @slot footer - Slot for footer content such as workflow buttons
 * @fires d2l-dialog-open - Dispatched when the dialog is opened
 * @fires d2l-dialog-close - Dispatched with the action value when the dialog is closed for any reason
 */
class DialogFullscreen extends LocalizeCoreElement(AsyncContainerMixin(DialogMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Whether to render a loading-spinner and wait for state changes via AsyncContainerMixin
			 */
			async: { type: Boolean },
			_hasFooterContent: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [ dialogStyles, heading3Styles, css`
			
			.d2l-dialog-footer.d2l-footer-no-content {
				display: none;
			}


			.d2l-dialog-content-loading {
				text-align: center;
			}

			@media (min-width: 616px) {
				
				.d2l-dialog-header {
					border-bottom: 1px solid var(--d2l-color-mica);
					padding-bottom: 1.15rem;
					padding-top: 1.15rem;
				}

				.d2l-dialog-content > div {
					/* required to properly calculate preferred height when there are bottom
					margins at the end of the slotted content */
					border-bottom: 1px solid transparent;
					box-sizing: border-box;
					height: 100%;
				}

				.d2l-dialog-header > div > d2l-button-icon {
					flex: none;
					margin: -4px -15px 0 15px;
				}

				:host([dir="rtl"]) .d2l-dialog-header > div > d2l-button-icon {
					margin-left: -15px;
					margin-right: 15px;
				}
				
				dialog.d2l-dialog-outer,
				div.d2l-dialog-outer {
					border: none;
					border-radius: 8px;
					box-shadow: none;
					height: auto;
					margin: 1.5rem;
					opacity: 0;
					top: 0;
					transform: translateY(-50px) scale(0.97);
					transition: transform 200ms ease-out, opacity 200ms ease-out;
					width: auto;
				}

				:host([_state="showing"]) dialog.d2l-dialog-outer {
					opacity: 1;
					transition-duration: 400ms;
				}

				dialog::backdrop {
					transition: opacity 200ms ease-out;
				}

				:host([_state="showing"]) dialog::backdrop {
					transition-duration: 400ms;
				}

				.d2l-dialog-footer {
					border-top: 1px solid var(--d2l-color-mica);
					padding-bottom: 0; /* 0.9rem padding included on button */
					padding-top: 0.9rem;
				}
			}

			@media (max-width: 615px) {

				.d2l-dialog-header {
					padding-bottom: 15px;
				}

				.d2l-dialog-header > div > d2l-button-icon {
					flex: none;
					margin: -8px -13px 0 15px;
				}

				.d2l-dialog-footer.d2l-footer-no-content {
					padding: 0 0 5px 0;
				}

				.d2l-dialog-content > div {
					/* required to properly calculate preferred height when there are bottom
					margins at the end of the slotted content */
					border-bottom: 1px solid transparent;
				}

				div[nested].d2l-dialog-outer {
					top: 0;
				}


				:host([dir="rtl"]) .d2l-dialog-header > div > d2l-button-icon {
					margin-left: -13px;
					margin-right: 15px;
				}
				
				dialog.d2l-dialog-outer,
				div.d2l-dialog-outer {
					height: auto;
					margin: 0 !important;
					min-height: calc(var(--d2l-vh, 1vh) * 100 - 42px);
					min-width: calc(var(--d2l-vw, 1vw) * 100);
					top: 42px;
				}
			}
		`];
	}

	constructor() {
		super();
		this.async = false;
		this._autoSize = false;
		this._hasFooterContent = false;
	}

	get asyncContainerCustom() {
		return true;
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

		const footerClasses = {
			'd2l-dialog-footer': true,
			'd2l-footer-no-content': !this._hasFooterContent
		};

		const content = html`
			${loading}
			<div style=${styleMap(slotStyles)}><slot></slot></div>
		`;

		if (!this._titleId) this._titleId = getUniqueId();
		const inner = html`
			<div class="d2l-dialog-inner">
				<div class="d2l-dialog-header">
					<div>
						<h3 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h3>
						<d2l-button-icon icon="tier1:close-large-thick" text="${this.localize('components.dialog.close')}" @click="${this._abort}"></d2l-button-icon>
					</div>
				</div>
				<div class="d2l-dialog-content" @pending-state="${this._handleAsyncItemState}">${content}</div>
				<div class="${classMap(footerClasses)}">
					<slot name="footer" @slotchange="${this._handleFooterSlotChange}"></slot>
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
			// while the dialog itself will not change size, we need to update overflow
			this.resize();
		}
	}

	_abort() {
		this._close('abort');
	}

	_handleFooterSlotChange(e) {
		const footerContent = e.target.assignedNodes({ flatten: true });
		this._hasFooterContent = (footerContent && footerContent.length > 0);
	}

}

customElements.define('d2l-dialog-fullscreen', DialogFullscreen);
