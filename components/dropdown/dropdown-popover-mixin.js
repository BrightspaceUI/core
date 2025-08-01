import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getFlag } from '../../helpers/flags.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PopoverMixin } from '../popover/popover-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

export const usePopoverMixin = getFlag('GAUD-7472-dropdown-popover', false);

export const DropdownPopoverMixin = superclass => class extends LocalizeCoreElement(PopoverMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Optionally align dropdown to either start or end. If not set, the dropdown will attempt to be centred.
			 * @type {'start'|'end'}
			 */
			align: { type: String },
			/**
			 * Override max-height. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 * @type {number}
			 */
			maxHeight: { type: Number, attribute: 'max-height' },
			/**
			 * Override default max-width (undefined). Specify a number that would be the px value.
			 * @type {number}
			 */
			maxWidth: { type: Number, attribute: 'max-width' },
			/**
			 * Override default height used for required space when `no-auto-fit` is true. Specify a number that would be the px value. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 * @type {number}
			 */
			minHeight: { type: Number, attribute: 'min-height' },
			/**
			 * Override default min-width (undefined). Specify a number that would be the px value.
			 * @type {number}
			 */
			minWidth: { type: Number, attribute: 'min-width' },
			/**
			 * Override the breakpoint at which mobile styling is used. Defaults to 616px.
			 * @type {number}
			 */
			mobileBreakpointOverride: { type: Number, attribute: 'mobile-breakpoint' },
			/**
			 * Mobile dropdown style.
			 * @type {'left'|'right'|'bottom'}
			 */
			mobileTray: { type: String, attribute: 'mobile-tray' },
			/**
			 * Opt out of automatically closing on focus or click outside of the dropdown content
			 * @type {boolean}
			 */
			noAutoClose: { type: Boolean, attribute: 'no-auto-close' },
			/**
			 * Opt out of auto-sizing
			 * @type {boolean}
			 */
			noAutoFit: { type: Boolean, attribute: 'no-auto-fit' },
			/**
			 * Opt out of focus being automatically moved to the first focusable element in the dropdown when opened
			 * @type {boolean}
			 */
			noAutoFocus: { type: Boolean, attribute: 'no-auto-focus' },
			/**
			 * Opt-out of showing a close button in the footer of tray-style mobile dropdowns.
			 * @type {boolean}
			 */
			noMobileCloseButton: { type: Boolean, attribute: 'no-mobile-close-button' },
			/**
			 * Render with no padding
			 * @type {boolean}
			 */
			noPadding: { type: Boolean, attribute: 'no-padding' },
			/**
			 * Render the footer with no padding (if it has content)
			 * @type {boolean}
			 */
			noPaddingFooter: { type: Boolean, attribute: 'no-padding-footer' },
			/**
			 * Render the header with no padding (if it has content)
			 * @type {boolean}
			 */
			noPaddingHeader: { type: Boolean, attribute: 'no-padding-header' },
			/**
			 * Render without a pointer
			 * @type {boolean}
			 */
			noPointer: { type: Boolean, attribute: 'no-pointer' },
			/**
			 * Whether the dropdown is open or not
			 * @type {boolean}
			 */
			opened: { type: Boolean, reflect: true },
			/**
 			 * Optionally render a d2l-focus-trap around the dropdown content
			 * @type {boolean}
 			 */
			trapFocus: { type: Boolean, attribute: 'trap-focus' },
			/**
			 * Provide custom offset, positive or negative
			 * @type {string}
			 */
			verticalOffset: { type: String, attribute: 'vertical-offset' },
			_blockEndScroll: { state: true },
			_blockStartScroll: { state: true },
			_dropdownContent: { type: Boolean, attribute: 'dropdown-content', reflect: true },
			_hasFooterSlotContent: { state: true },
			_hasHeaderSlotContent: { state: true }
		};
	}

	static get styles() {
		return [super.styles, css`
			.dropdown-content-layout {
				align-items: flex-start;
				display: flex;
				flex-direction: column;
			}
			.dropdown-content {
				box-sizing: border-box;
				flex: auto;
				max-width: 100%;
				overflow-y: auto;
				padding: 1rem;
			}
			.dropdown-header,
			.dropdown-footer {
				box-sizing: border-box;
				flex: none;
				max-width: 100%;
				min-height: 5px;
				padding: 1rem;
				position: relative;
				width: 100%;
				z-index: 2;
			}
			.dropdown-header {
				border-block-end: 1px solid var(--d2l-popover-border-color, var(--d2l-popover-default-border-color));
				border-start-end-radius: var(--d2l-popover-border-radius, var(--d2l-popover-default-border-radius));
				border-start-start-radius: var(--d2l-popover-border-radius, var(--d2l-popover-default-border-radius));
			}
			.dropdown-footer {
				border-block-start: 1px solid var(--d2l-popover-border-color, var(--d2l-popover-default-border-color));
				border-end-end-radius: var(--d2l-popover-border-radius, var(--d2l-popover-default-border-radius));
				border-end-start-radius: var(--d2l-popover-border-radius, var(--d2l-popover-default-border-radius));
			}
			.dropdown-no-header {
				border-block-end: none;
				padding: 0;
			}
			.dropdown-no-footer {
				border-block-start: none;
				padding: 0;
			}
			.dropdown-no-padding {
				padding: 0;
			}
			.dropdown-header-scroll {
				box-shadow: 0 3px 3px 0 var(--d2l-popover-shadow-color, var(--d2l-popover-default-shadow-color));
			}
			.dropdown-footer-scroll {
				box-shadow: 0 -3px 3px 0 var(--d2l-popover-shadow-color, var(--d2l-popover-default-shadow-color));
			}

			:host([_mobile][_mobile-tray-location="inline-start"][opened]) .dropdown-content-layout,
			:host([_mobile][_mobile-tray-location="inline-end"][opened]) .dropdown-content-layout {
				height: 100vh;
			}
		`];
	}

	constructor() {
		super();
		this.opened = false;
		this.noAutoClose = false;
		this.noAutoFit = false;
		this.noAutoFocus = false;
		this.noPadding = false;
		this.noPaddingFooter = false;
		this.noPaddingHeader = false;
		this.noPointer = false;
		this.trapFocus = false;

		this._blockEndScroll = false;
		this._blockStartScroll = false;
		this._dropdownContent = true;
		this._hasFooterSlotContent = false;
		this._hasHeaderSlotContent = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.#contentElement = this.shadowRoot?.querySelector('.dropdown-content');
		this.addEventListener('d2l-popover-open', this.#handlePopoverOpen);
		this.addEventListener('d2l-popover-close', this.#handlePopoverClose);
		this.addEventListener('d2l-popover-position', this.#handlePopoverPosition);
	}

	render() {

		const fillHeight = this._mobile && (this._mobileTrayLocation === 'inline-start' || this._mobileTrayLocation === 'inline-end');
		const contentLayoutStyles = {
			maxHeight: (!fillHeight && this._contentHeight) ? `${this._contentHeight}px` : undefined
		};
		const contentClasses = {
			'dropdown-content': true,
			'dropdown-no-padding': this.noPadding
		};
		const headerClasses = {
			'dropdown-header': true,
			'dropdown-no-header': !this._hasHeaderSlotContent,
			'dropdown-no-padding': this.noPaddingHeader,
			'dropdown-header-scroll': this._blockStartScroll
		};
		const footerClasses = {
			'dropdown-footer': true,
			'dropdown-no-footer': !(this._hasFooterSlotContent || (this._mobile && this._mobileTrayLocation && !this.noMobileCloseButton)),
			'dropdown-no-padding': this.noPaddingFooter,
			'dropdown-footer-scroll': this._blockEndScroll
		};

		const closeButtonStyles = this.#getMobileCloseButtonStyles();

		const content = html`
			<div class="dropdown-content-layout" style="${styleMap(contentLayoutStyles)}">
				<div class="${classMap(headerClasses)}">
					<slot name="header" @slotchange="${this.#handleHeaderSlotChange}"></slot>
				</div>
				<div class="${classMap(contentClasses)}" @scroll="${this.#toggleScrollStyles}">
					<slot></slot>
				</div>
				<div class="${classMap(footerClasses)}">
					<slot name="footer" @slotchange="${this.#handleFooterSlotChange}"></slot>
					<d2l-button style=${styleMap(closeButtonStyles)} @click=${this.close}>
						${this.localize('components.dropdown.close')}
					</d2l-button>
				</div>
			</div>			
		`;

		return this.renderPopover(content);
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('align') || changedProperties.has('maxHeight') || changedProperties.has('maxWidth') || changedProperties.has('minHeight') || changedProperties.has('minWidth') || changedProperties.has('mobileBreakpointOverride') || changedProperties.has('mobileTray') || changedProperties.has('noAutoClose') || changedProperties.has('noAutoFit') || changedProperties.has('noAutoFocus') || changedProperties.has('noPointer') || changedProperties.has('trapFocus') || changedProperties.has('verticalOffset')) {
			super.configure({
				maxHeight: this.maxHeight,
				maxWidth: this.maxWidth,
				minHeight: this.minHeight,
				minWidth: this.minWidth,
				mobileBreakpoint: this.mobileBreakpointOverride,
				mobileTrayLocation: this.#adaptMobileTrayLocation(this.mobileTray),
				noAutoClose: this.noAutoClose,
				noAutoFit: this.noAutoFit,
				noAutoFocus: this.noAutoFocus,
				noPointer: this.noPointer,
				offset: (this.verticalOffset !== undefined ? Number.parseInt(this.verticalOffset) : undefined),
				position: { location: 'block-end', span: this.#adaptPositionSpan(this.align) },
				trapFocus: this.trapFocus
			});
		}

		if (changedProperties.has('opened')) {
			if (this.opened) this.open(true);
			else if (changedProperties.get('opened')) this.close();
		}
	}

	async open(applyFocus = true) {
		const opener = this.#getOpener();
		super.open(opener, applyFocus);
	}

	toggleOpen(applyFocus = true) {
		const opener = this.#getOpener();
		super.toggleOpen(opener, applyFocus);
	}

	#contentElement;

	#adaptMobileTrayLocation(val) {
		switch (val) {
			case 'bottom': return 'block-end';
			case 'left': return 'inline-start';
			case 'right': return 'inline-end';
			default: return undefined;
		}
	}

	#adaptPositionSpan(val) {
		switch (val) {
			case 'start': return 'end';
			case 'end': return 'start';
			default: return 'all';
		}
	}

	#getMobileCloseButtonStyles() {
		if (!this._mobile || !this._mobileTrayLocation) {
			return { display: 'none' };
		}

		let footerWidth;
		if (this.noPaddingFooter) {
			footerWidth = 'calc(100% - 24px)';
		} else if (this._hasFooterSlotContent) {
			footerWidth = '100%';
		} else {
			footerWidth = 'calc(100% + 16px)';
		}

		return {
			display: !this.noMobileCloseButton ? 'inline-block' : 'none',
			marginBlock: this._hasFooterSlotContent ? '0' : '-20px -20px',
			marginInline: this._hasFooterSlotContent ? '0' : '-20px 0',
			padding: this._hasFooterSlotContent && !this.noPaddingFooter ? '12px 0 0 0' : '12px',
			width: footerWidth
		};
	}

	#getOpener() {
		return findComposedAncestor(this, elem => elem.dropdownOpener);
	}

	#handleFooterSlotChange(e) {
		this._hasFooterSlotContent = e.target.assignedNodes().length !== 0;
	}

	#handleHeaderSlotChange(e) {
		this._hasHeaderSlotContent = e.target.assignedNodes().length !== 0;
	}

	#handlePopoverClose() {
		setTimeout(() => {
			this.opened = false;

			/** Dispatched when the dropdown is closed */
			this.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));
		});
	}

	#handlePopoverOpen() {
		this.opened = true;

		if (!this.noAutoFit && this.#contentElement) {
			this.#contentElement.scrollTop ??= 0;
		}

		setTimeout(() => {
			/** Dispatched when the dropdown is opened */
			this.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
		});
	}

	#handlePopoverPosition() {
		this.#toggleScrollStyles();

		/** Dispatched when the dropdown position finishes adjusting */
		this.dispatchEvent(new CustomEvent('d2l-dropdown-position', { bubbles: true, composed: true }));
	}

	#toggleScrollStyles() {
		this._blockEndScroll = this.#contentElement.scrollHeight - (this.#contentElement.scrollTop + this.#contentElement.clientHeight) >= 5;
		this._blockStartScroll = this.#contentElement.scrollTop !== 0;
	}

};
