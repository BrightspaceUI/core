import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { PopoverMixin } from '../popover-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

class Popover extends PopoverMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether to disable auto-close/light-dismiss
			 * @type {boolean}
			 */
			noAutoClose: { type: Boolean, reflect: true, attribute: 'no-auto-close' },
			/**
			 * Whether to disable auto-focus on the first focusable element when opened
			 * @type {boolean}
			 */
			noAutoFocus: { type: Boolean, reflect: true, attribute: 'no-auto-focus' },
			/**
			 * Whether the popover is open or not
			 * @type {boolean}
			 */
			opened: { type: Boolean, reflect: true },
			/**
			 * Whether to render a d2l-focus-trap around the content
			 * @type {boolean}
			*/
			trapFocus: { type: Boolean, reflect: true, attribute: 'trap-focus' }
		};
	}

	static get styles() {
		return [super.styles, css`
			.test-content-layout {
				align-items: flex-start;
				display: flex;
				flex-direction: column;
				/*max-width: 370px;*/
				/*min-width: 70px;*/
				/*position: absolute;*/
				/*width: 100vw;*/
			}
			.test-content {
				box-sizing: border-box;
				max-width: 100%;
				overflow-y: auto;
				padding: 1rem;
			}
		`];
	}

	constructor() {
		super();
		this.noAutoClose = false;
		this.noAutoFocus = false;
		this.opened = false;
		this.trapFocus = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-popover-open', this._handlePopoverOpen);
		this.addEventListener('d2l-popover-close', this._handlePopoverClose);
	}

	render() {

		/*
		const topClasses = {
			'd2l-dropdown-content-top': true,
			'd2l-dropdown-content-top-scroll': this._topOverflow,
			'd2l-dropdown-content-header': this._hasHeader
		};
		const bottomClasses = {
			'd2l-dropdown-content-bottom': true,
			'd2l-dropdown-content-bottom-scroll': this._bottomOverflow,
			'd2l-dropdown-content-footer': this._hasFooter || (this._useMobileStyling && this.mobileTray && !this.noMobileCloseButton)
		};
		*/

		/*
		<div class=${classMap(topClasses)} style=${styleMap(headerStyle)}>
			<slot name="header" @slotchange="${this.__handleHeaderSlotChange}"></slot>
		</div>

		<div class=${classMap(bottomClasses)} style=${styleMap(footerStyle)}>
			<slot name="footer" @slotchange="${this.__handleFooterSlotChange}"></slot>
			<d2l-button
				class="dropdown-close-btn"
				style=${styleMap(closeButtonStyles)}
				@click=${this.close}>
				${this.localize('components.dropdown.close')}
			</d2l-button>
		</div>

		*/

		const topClasses = {};
		const headerStyle = {};
		const bottomClasses = {};
		const footerStyle = {};

		const content = html`
			<div class="test-content-layout">
				<div class="${classMap(topClasses)}" style="${styleMap(headerStyle)}">
					<slot name="header" @slotchange="${this._handleHeaderSlotChange}"></slot>
				</div>
				<div class="test-content" @scroll="${this._handleContentScroll}">
					<slot></slot>
				</div>
				<div class=${classMap(bottomClasses)} style=${styleMap(footerStyle)}>
					<slot name="footer" @slotchange="${this._handleFooterSlotChange}"></slot>
				</div>
			</div>
		`;

		return this._renderPopover(content);
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('noAutoClose') || changedProperties.has('noAutoFocus') || changedProperties.has('trapFocus')) {
			super.configure({
				noAutoClose: this.noAutoClose,
				noAutoFocus: this.noAutoFocus,
				trapFocus: this.trapFocus
			});
		}
		if (changedProperties.has('opened')) {
			if (this.opened) this.open(true);
			else if (changedProperties.get('opened')) this.close();
		}
	}

	_getContentBottom() {
		return this.shadowRoot.querySelector('.content-bottom');
	}

	_getContentContainer() {
		return this.shadowRoot.querySelector('.test-content');
	}

	_getContentTop() {
		return this.shadowRoot.querySelector('.content-top');
	}

	_handleContentScroll() {
		console.log('handle content scroll');
	}

	_handleFooterSlotChange() {
		console.log('handle footer slot change');
	}

	_handleHeaderSlotChange() {
		console.log('handle header slot change');
	}

	_handlePopoverOpen() {
		this.opened = true;

		const content = this._getContentContainer();
		if (!this.noAutoFit) {
			content.scrollTop = 0;
		}
	}

	_handlePopoverClose() {
		this.opened = false;
	}

}
customElements.define('d2l-test-popover', Popover);
