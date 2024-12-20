import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { PopoverMixin } from '../popover-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

class Popover extends PopoverMixin(LitElement) {

	static get properties() {
		return {
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
			 * Whether the popover is open or not
			 * @type {boolean}
			 */
			opened: { type: Boolean, reflect: true },
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
			_hasFooter: { state: true },
			_hasHeader: { state: true }
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
				max-width: 100%;
				overflow-y: auto;
				padding: 1rem;
			}
			.test-no-header {
				display: none;
			}
			.test-no-footer {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.noAutoClose = false;
		this.noAutoFocus = false;
		this.noPointer = false;
		this.opened = false;
		this.trapFocus = false;

		this._hasFooter = false;
		this._hasHeader = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-popover-open', this.#handlePopoverOpen);
		this.addEventListener('d2l-popover-close', this.#handlePopoverClose);
	}

	render() {

		const headerClasses = {
			'test-header': true,
			'test-no-header': !this._hasHeader
		};
		const headerStyle = {};

		const footerClasses = {
			'test-footer': true,
			'test-no-footer': !this._hasFooter
		};
		const footerStyle = {};

		const content = html`
			<div class="test-content-layout">
				<div class="${classMap(headerClasses)}" style="${styleMap(headerStyle)}">
					<slot name="header" @slotchange="${this.#handleHeaderSlotChange}"></slot>
				</div>
				<div class="test-content" @scroll="${this.#handleContentScroll}">
					<slot></slot>
				</div>
				<div class=${classMap(footerClasses)} style=${styleMap(footerStyle)}>
					<slot name="footer" @slotchange="${this.#handleFooterSlotChange}"></slot>
				</div>
			</div>
		`;

		return this.renderPopover(content);
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('maxHeight') || changedProperties.has('maxWidth') || changedProperties.has('minHeight') || changedProperties.has('minWidth') || changedProperties.has('noAutoClose') || changedProperties.has('noAutoFocus') || changedProperties.has('positionLocation') || changedProperties.has('positionSpan') || changedProperties.has('trapFocus')) {
			super.configure({
				maxHeight: this.maxHeight,
				maxWidth: this.maxWidth,
				minHeight: this.minHeight,
				minWidth: this.minWidth,
				noAutoClose: this.noAutoClose,
				noAutoFocus: this.noAutoFocus,
				noPointer: this.noPointer,
				mobileTrayLocation: this.mobileTrayLocation,
				position: { location: this.positionLocation, span: this.positionSpan },
				trapFocus: this.trapFocus
			});
		}
		if (changedProperties.has('opened')) {
			if (this.opened) this.open(true);
			else if (changedProperties.get('opened')) this.close();
		}
	}

	#getContentContainer() {
		return this.shadowRoot.querySelector('.test-content');
	}

	#handleContentScroll() {
		// eslint-disable-next-line
		console.log('handle content scroll');
	}

	#handleFooterSlotChange(e) {
		this._hasFooter = e.target.assignedNodes().length !== 0;
	}

	#handleHeaderSlotChange(e) {
		this._hasHeader = e.target.assignedNodes().length !== 0;
	}

	#handlePopoverClose() {
		this.opened = false;
	}

	#handlePopoverOpen() {
		this.opened = true;

		const content = this.#getContentContainer();
		if (!this.noAutoFit && content) {
			content.scrollTop ??= 0;
		}
	}

}
customElements.define('d2l-test-popover', Popover);
