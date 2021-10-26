import '../button/button-icon.js';
import '../loading-spinner/loading-spinner.js';
import '../../helpers/viewport-size.js';
import { AsyncContainerMixin, asyncStates } from '../../mixins/async-container/async-container-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const mediaQueryList = window.matchMedia('(max-width: 615px), (max-height: 420px) and (max-width: 900px)');

/**
 * A generic dialog that provides a slot for arbitrary content and a "footer" slot for workflow buttons. Apply the "data-dialog-action" attribute to workflow buttons to automatically close the dialog with the action value.
 * @slot - Default slot for content inside dialog
 * @slot footer - Slot for footer content such as workflow buttons
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
			width: { type: Number },
			_hasFooterContent: { type: Boolean, attribute: false }
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

			.d2l-dialog-footer.d2l-footer-no-content {
				padding: 0 0 5px 0;
			}

			@media (max-width: 615px), (max-height: 420px) and (max-width: 900px) {

				.d2l-dialog-outer {
					margin: 0 !important;
					min-width: calc(var(--d2l-vw, 1vw) * 100);
					top: 42px;
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

				:host(:not([in-iframe])) dialog.d2l-dialog-outer,
				:host(:not([in-iframe])) div.d2l-dialog-outer {
					height: calc(var(--d2l-vh, 1vh) * 100 - 42px);
					min-height: calc(var(--d2l-vh, 1vh) * 100 - 42px);
				}
			}

		`];
	}

	constructor() {
		super();
		this.async = false;
		this.width = 600;
		this._handleResize = this._handleResize.bind(this);
		this._handleResize();
	}

	get asyncContainerCustom() {
		return true;
	}

	connectedCallback() {
		super.connectedCallback();
		if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', this._handleResize);
	}

	disconnectedCallback() {
		if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', this._handleResize);
		super.disconnectedCallback();
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

		const heightOverride = {} ;
		let topOverride = null;
		if (mediaQueryList.matches) {
			if (this._ifrauContextInfo) {
				// in iframes, use calculated available height from dialog mixin minus padding
				heightOverride.minHeight = `${this._ifrauContextInfo.availableHeight - 42}px`;
				heightOverride.top = `${this._top + this._margin.top + 42}px`;
				const iframeTop = this._ifrauContextInfo.top < 0
					? -this._ifrauContextInfo.top
					: 0;
				topOverride = iframeTop + 42;
			}
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
			<div class="d2l-dialog-inner"  style=${styleMap(heightOverride)}>
				<div class="d2l-dialog-header">
					<div>
						<h2 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h2>
						<d2l-button-icon icon="tier1:close-small" text="${this.localize('components.dialog.close')}" @click="${this._abort}"></d2l-button-icon>
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
			{ labelId: this._titleId, role: 'dialog' },
			topOverride
		);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('asyncState')) return;
		if (this.asyncState === asyncStates.complete) {
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

	_handleResize() {
		this._autoSize = !mediaQueryList.matches;
		this.resize();
	}

}

customElements.define('d2l-dialog', Dialog);
