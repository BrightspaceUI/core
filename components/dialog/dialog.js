import '../button/button-icon.js';
import '../loading-spinner/loading-spinner.js';
import { _generateResetStyles, heading3Styles } from '../typography/styles.js';
import { AsyncContainerMixin, asyncStates } from '../../mixins/async-container/async-container-mixin.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const mediaQueryList = window.matchMedia('(max-width: 615px), (max-height: 420px) and (max-width: 900px)');

/**
 * A generic dialog that provides a slot for arbitrary content and a "footer" slot for workflow buttons. Apply the "data-dialog-action" attribute to workflow buttons to automatically close the dialog with the action value.
 * @fires d2l-dialog-before-close - Dispatched with the action value before the dialog is closed for any reason, providing an opportunity to prevent the dialog from closing
 * @slot - Default slot for content inside dialog
 * @slot footer - Slot for footer content such as workflow buttons
 */
class Dialog extends PropertyRequiredMixin(LocalizeCoreElement(AsyncContainerMixin(DialogMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Whether to render a loading-spinner and wait for state changes via AsyncContainerMixin
			 */
			async: { type: Boolean },

			/**
			 * Whether the dialog should indicate that its message is important to the user
			 */
			critical: { type: Boolean },

			/**
			 * Causes screen readers to announce the content of the dialog on open. Only use if the content is concise and contains only text since screen readers ignore HTML semantics and some have a ~250 character limit.
			 */
			describeContent: { type: Boolean, attribute: 'describe-content' },

			/**
			 * Whether to render the dialog at the maximum height
			 */
			fullHeight: { type: Boolean, attribute: 'full-height' },

			/**
			 * REQUIRED: the title for the dialog
			 */
			titleText: { type: String, attribute: 'title-text', required: true },

			/**
			 * The preferred width (unit-less) for the dialog
			 */
			width: { type: Number },
			_hasFooterContent: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [ _generateResetStyles(':host'), dialogStyles, heading3Styles, css`

			.d2l-dialog-header,
			:host([critical]) .d2l-dialog-header {
				padding-bottom: 15px;
			}

			.d2l-dialog-header > div > d2l-button-icon {
				flex: none;
				margin-block: -4px 0;
				margin-inline: 15px -15px;
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

				.d2l-dialog-header,
				:host([critical]) .d2l-dialog-header {
					padding-bottom: 9px;
				}

			}

		`];
	}

	constructor() {
		super();
		this.async = false;
		this.critical = false;
		this.describeContent = false;
		this.fullHeight = false;
		this.width = 600;
		this._criticalLabelId = getUniqueId();
		this._handleResize = this._handleResize.bind(this);
		this._titleId = getUniqueId();
		this._textId = getUniqueId();
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

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._handleResize();
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
			<div id="${ifDefined(this._textId)}" style=${styleMap(slotStyles)}><slot @slotchange="${this._handleSlotChange}"></slot></div>
		`;

		const contentTabIndex = !this.focusableContentElemPresent ? '0' : undefined;
		const labelId = this.critical ? `${this._criticalLabelId} ${this._titleId}` : this._titleId;
		const inner = html`
			${this.critical ? html`<div id="${this._criticalLabelId}" hidden>${this.localize('components.dialog.critical')}</div>` : nothing}
			<div class="d2l-dialog-inner" style=${styleMap(heightOverride)}>
				<div class="d2l-dialog-header">
					<div>
						<h2 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h2>
						<d2l-button-icon icon="tier1:close-small" text="${this.localize('components.dialog.close')}" @click="${this._abort}"></d2l-button-icon>
					</div>
				</div>
				<div class="d2l-dialog-content" @pending-state="${this._handleAsyncItemState}" tabindex="${ifDefined(contentTabIndex)}">${content}</div>
				<div class="${classMap(footerClasses)}">
					<slot name="footer" @slotchange="${this._handleFooterSlotChange}"></slot>
				</div>
			</div>
		`;

		const descId = (this.describeContent) ? this._textId : undefined;
		return this._render(
			inner,
			{
				descId: descId,
				fullscreenMobile: true,
				labelId: labelId,
				role: 'dialog'
			},
			topOverride
		);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('asyncState')) return;
		if (this.asyncState === asyncStates.complete) {
			this.waitForUpdateComplete().then(() => this.resize());
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

	_handleSlotChange() {
		requestAnimationFrame(() => this._updateFocusableContentElemPresent());
	}

}

customElements.define('d2l-dialog', Dialog);
