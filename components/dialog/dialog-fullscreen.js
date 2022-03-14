import '../button/button-icon.js';
import '../loading-spinner/loading-spinner.js';
import { AsyncContainerMixin, asyncStates } from '../../mixins/async-container/async-container-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles, heading3Styles } from '../typography/styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const mediaQueryList = window.matchMedia('(max-width: 615px), (max-height: 420px) and (max-width: 900px)');

/**
 * A generic fullscreen dialog that provides a slot for arbitrary content and a "footer" slot for workflow buttons. Apply the "data-dialog-action" attribute to workflow buttons to automatically close the dialog with the action value.
 * @slot - Default slot for content inside dialog
 * @slot footer - Slot for footer content such as workflow buttons
 */
class DialogFullscreen extends LocalizeCoreElement(AsyncContainerMixin(DialogMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Whether to render a loading-spinner and wait for state changes via AsyncContainerMixin
			 * @type {boolean}
			 */
			async: { type: Boolean },
			_hasFooterContent: { type: Boolean, attribute: false },
			_icon: { type: String, attribute: false },
			_headerStyle: { type: String, attribute: false }
		};
	}

	static get styles() {
		return [ dialogStyles, heading2Styles, heading3Styles, css`

			.d2l-dialog-footer.d2l-footer-no-content {
				display: none;
			}

			.d2l-dialog-content-loading {
				text-align: center;
			}

			@media (min-width: 616px) {

				.d2l-dialog-header {
					border-bottom: 1px solid var(--d2l-color-gypsum);
					padding-bottom: 0.9rem;
					padding-top: 1rem;
				}

				.d2l-dialog-content {
					padding-top: 1rem;
				}

				.d2l-dialog-content > div {
					/* required to properly calculate preferred height when there are bottom
					margins at the end of the slotted content */
					border-bottom: 1px solid transparent;
					box-sizing: border-box;
					height: calc(100% - 1rem);
				}

				.d2l-dialog-header > div > d2l-button-icon {
					flex: none;
					margin: -2px -12px 0 0;
				}

				:host([dir="rtl"]) .d2l-dialog-header > div > d2l-button-icon {
					margin: -2px 0 0 -12px;
				}

				dialog.d2l-dialog-outer,
				div.d2l-dialog-outer {
					border-radius: 8px;
					margin: 1.5rem;
					max-width: 1170px;
					opacity: 0;
					top: 0;
					transform: translateY(-50px) scale(0.97);
					transition: transform 200ms ease-out, opacity 200ms ease-out;
					width: auto;
				}

				dialog.d2l-dialog-outer.d2l-dialog-fullscreen-within,
				div.d2l-dialog-outer.d2l-dialog-fullscreen-within {
					/* no margins when there is a fullscreen element within */
					margin: 0;
				}

				:host(:not([in-iframe])) dialog.d2l-dialog-outer,
				:host(:not([in-iframe])) div.d2l-dialog-outer {
					height: calc(100% - 3rem);
				}

				/* for screens wider than 1170px + 60px margins */
				@media (min-width: 1230px) {
					dialog.d2l-dialog-outer,
					div.d2l-dialog-outer {
						/* center the dialog */
						margin-left: auto;
						margin-right: auto;
					}
				}

				:host([_state="showing"]) dialog.d2l-dialog-outer,
				:host([_state="showing"]) div.d2l-dialog-outer {
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
					border-top: 1px solid var(--d2l-color-gypsum);
					padding-bottom: 0; /* 0.9rem padding included on button */
					padding-top: 0.9rem;
				}

				@media (prefers-reduced-motion: reduce) {

					dialog.d2l-dialog-outer,
					div.d2l-dialog-outer {
						transition: none;
					}

					dialog::backdrop {
						transition: none;
					}
				}
			}

			@media (max-width: 615px), (max-height: 420px) and (max-width: 900px) {

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
					/* required to render full height in an i-Frame */
					height: calc(100% - 1px);
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
					margin: 0 !important;
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
		this._icon = 'tier1:close-large-thick';
		this._headerStyle = 'd2l-heading-2';
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

		const heightOverride = {} ;
		let topOverride = null;
		if (this._ifrauContextInfo) {
			// in iframes, use calculated available height from dialog mixin minus padding
			heightOverride.height = mediaQueryList.matches
				? `${this._ifrauContextInfo.availableHeight - 42}px`
				: `${this._ifrauContextInfo.availableHeight - 60}px`;
			heightOverride.minHeight = heightOverride.height;
			const iframeTop = this._ifrauContextInfo.top < 0
				? -this._ifrauContextInfo.top
				: 0;
			const startTop = mediaQueryList.matches ? 42 : 0;
			topOverride = iframeTop + startTop;
		} else if (window.innerWidth <= 615 || (window.innerWidth <= 900 && window.innerHeight <= 420)) {
			heightOverride.height = `${window.innerHeight - 42 - 2}px`; // render full window height - 42px top padding - 2px border
			heightOverride.minHeight = heightOverride.height;
		}

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
			<div class="d2l-dialog-inner" style=${styleMap(heightOverride)}>
				<div class="d2l-dialog-header">
					<div>
						<h2 id="${this._titleId}" class="${this._headerStyle}">${this.titleText}</h2>
						<d2l-button-icon icon="${this._icon}" text="${this.localize('components.dialog.close')}" @click="${this._abort}"></d2l-button-icon>
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

	_handleResize() {
		this._icon =  mediaQueryList.matches ? 'tier1:close-small' : 'tier1:close-large-thick';
		this._headerStyle =  mediaQueryList.matches ? 'd2l-heading-3' : 'd2l-heading-2';
	}

}

customElements.define('d2l-dialog-fullscreen', DialogFullscreen);
