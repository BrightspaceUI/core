import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { PopoverMixin } from '../popover-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

class Popover extends PopoverMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Margin to include when computing space available.
			 * @type {number}
			 */
			margin: { type: Number, reflect: true, attribute: 'margin' },
			/**
			 * Max-height. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 * @type {number}
			 */
			maxHeight: { type: Number, reflect: true, attribute: 'max-height' },
			/**
			 * Max-width (undefined). Specify a number that would be the px value.
			 * @type {number}
			 */
			maxWidth: { type: Number, reflect: true, attribute: 'max-width' },
			/**
			 * Min-height used when `no-auto-fit` is true. Specify a number that would be the px value. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 * @type {number}
			 */
			minHeight: { type: Number, reflect: true, attribute: 'min-height' },
			/**
			 * Min-width (undefined). Specify a number that would be the px value.
			 * @type {number}
			 */
			minWidth: { type: Number, reflect: true, attribute: 'min-width' },
			/**
			 * Mobile tray location.
			 * @type {'inline-start'|'inline-end'|'block-end'}
			 */
			mobileTrayLocation: { type: String, reflect: true, attribute: 'mobile-tray-location' },
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
			 * Render without a pointer
			 * @type {boolean}
			 */
			noPointer: { type: Boolean, reflect: true, attribute: 'no-pointer' },
			/**
			 * Position the popover before or after the opener. Default is "block-end" (after).
			 * @type {'block-start'|'block-end'}
			 */
			positionLocation: { type: String, reflect: true, attribute: 'position-location' },
			/**
			 * Position the popover to span from the opener edge to this grid line. Default is "all" (centered).
			 * @type {'start'|'end'|'all'}
			 */
			positionSpan: { type: String, reflect: true, attribute: 'position-span' },
			/**
			 * Whether to render a d2l-focus-trap around the content
			 * @type {boolean}
			*/
			trapFocus: { type: Boolean, reflect: true, attribute: 'trap-focus' },
			_hasFooterSlotContent: { state: true },
			_hasHeaderSlotContent: { state: true }
		};
	}

	static get styles() {
		return [super.styles, css`
			.test-content-layout {
				align-items: flex-start;
				display: flex;
				flex-direction: column;
			}
			.test-content {
				box-sizing: border-box;
				flex: auto;
				max-width: 100%;
				overflow-y: auto;
				padding: 1rem;
			}
			.test-header,
			.test-footer {
				box-sizing: border-box;
				flex: none;
				max-width: 100%;
				width: 100%;
			}
			.test-footer {
				padding: 0 1rem 1rem 1rem;
			}
			.test-no-header,
			.test-no-footer {
				display: none;
			}
			.test-close {
				margin-block-start: 12px;
				width: 100%;
			}
			.test-no-close {
				display: none;
			}
			.test-close-no-margin {
				margin-block-start: 0;
			}
		`];
	}

	constructor() {
		super();
		this.noAutoClose = false;
		this.noAutoFocus = false;
		this.noPointer = false;
		this.trapFocus = false;

		this._hasFooterSlotContent = false;
		this._hasHeaderSlotContent = false;
	}

	get opened() {
		return this._opened;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-popover-open', this.#handlePopoverOpen);
	}

	render() {

		const contentLayoutStyles = {
			maxHeight: this._contentHeight ? `${this._contentHeight}px` : undefined
		};
		const headerClasses = {
			'test-header': true,
			'test-no-header': !this._hasHeaderSlotContent
		};
		const footerClasses = {
			'test-footer': true,
			'test-no-footer': !(this._hasFooterSlotContent || (this._mobile && this._mobileTrayLocation))
		};
		const closeButtonClasses = {
			'test-close': true,
			'test-no-close': !(this._mobile && this._mobileTrayLocation),
			'test-close-no-margin': !this._hasFooterSlotContent
		};

		const content = html`
			<div class="test-content-layout" style="${styleMap(contentLayoutStyles)}">
				<div class="${classMap(headerClasses)}">
					<slot name="header" @slotchange="${this.#handleHeaderSlotChange}"></slot>
				</div>
				<div class="test-content" @scroll="${this.#handleContentScroll}">
					<slot></slot>
				</div>
				<div class="${classMap(footerClasses)}">
					<slot name="footer" @slotchange="${this.#handleFooterSlotChange}"></slot>
					<d2l-button class="${classMap(closeButtonClasses)}" @click=${this.#handleCloseButtonClick}>Close</d2l-button>
				</div>
			</div>
		`;

		return this.renderPopover(content);
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('margin') || changedProperties.has('maxHeight') || changedProperties.has('maxWidth') || changedProperties.has('minHeight') || changedProperties.has('minWidth') || changedProperties.has('noAutoClose') || changedProperties.has('noAutoFocus') || changedProperties.has('positionLocation') || changedProperties.has('positionSpan') || changedProperties.has('trapFocus')) {
			super.configure({
				margin: this.margin,
				maxHeight: this.maxHeight,
				maxWidth: this.maxWidth,
				minHeight: this.minHeight,
				minWidth: this.minWidth,
				mobileTrayLocation: this.mobileTrayLocation,
				noAutoClose: this.noAutoClose,
				noAutoFocus: this.noAutoFocus,
				noPointer: this.noPointer,
				position: { location: this.positionLocation, span: this.positionSpan },
				trapFocus: this.trapFocus
			});
		}
	}

	#getContentContainer() {
		return this.shadowRoot.querySelector('.test-content');
	}

	#handleCloseButtonClick() {
		this.close();
	}

	#handleContentScroll() {
		// eslint-disable-next-line
		console.log('handle content scroll');
	}

	#handleFooterSlotChange(e) {
		this._hasFooterSlotContent = e.target.assignedNodes().length !== 0;
	}

	#handleHeaderSlotChange(e) {
		this._hasHeaderSlotContent = e.target.assignedNodes().length !== 0;
	}

	#handlePopoverOpen() {
		const content = this.#getContentContainer();
		if (!this.noAutoFit && content) {
			content.scrollTop ??= 0;
		}
	}

}
customElements.define('d2l-test-popover', Popover);
