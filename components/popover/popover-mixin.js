import '../colors/colors.js';
import { css, html } from 'lit';
import { getComposedActiveElement, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { isComposedAncestor } from '../../helpers/dom.js';

const isSupported = ('popover' in HTMLElement.prototype);

// eslint-disable-next-line no-console
console.log('Popover', isSupported);

export const PopoverMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Whether the popover is open or not
			 * @type {boolean}
			 */
			opened: { type: Boolean, reflect: true },
			/**
			 * Whether to disable auto-close/light-dismiss
			 * @type {boolean}
			 */
			noAutoClose: { type: Boolean, reflect: true, attribute: 'no-auto-close' },
			_useNativePopover: { type: String, reflect: true, attribute: 'popover' }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-popover-default-background-color: #ffffff;
				--d2l-popover-default-border-color: var(--d2l-color-mica);
				--d2l-popover-default-border-radius: 0.3rem;
				--d2l-popover-default-foreground-color: var(--d2l-color-ferrite);
				--d2l-popover-default-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
				background-color: transparent;
				border: none;
				box-sizing: border-box;
				color: var(--d2l-popover-foreground-color, var(--d2l-popover-default-foreground-color));
				display: none;
				height: fit-content;
				inset: 0;
				margin: auto;
				overflow: visible;
				padding: 0;
				position: fixed;
				width: fit-content;
			}
			:host([hidden]) {
				display: none;
			}
			:host(:not([popover])) {
				z-index: 998; /* position on top of floating buttons */
			}
			:host([opened]) {
				display: inline-block;
			}

			.content {
				background-color: var(--d2l-popover-background-color, var(--d2l-popover-default-background-color));
				border: 1px solid var(--d2l-popover-border-color, var(--d2l-popover-default-border-color));
				border-radius: var(--d2l-popover-border-radius, var(--d2l-popover-default-border-radius));
				box-shadow: var(--d2l-popover-shadow, var(--d2l-popover-default-shadow));
				box-sizing: border-box;
			}
		`;
	}

	constructor() {
		super();
		this.noAutoClose = false;
		this.opened = false;
		this._useNativePopover = isSupported ? 'manual' : undefined;
		this._handleAutoCloseClick = this._handleAutoCloseClick.bind(this);
		this._handleAutoCloseFocus = this._handleAutoCloseFocus.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.opened) this._addAutoCloseHandlers();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeAutoCloseHandlers();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('opened')) {

			if (this._useNativePopover) {
				if (this.opened) this.showPopover();
				else this.hidePopover();
			}

			this._previousFocusableAncestor = this.opened ? getPreviousFocusableAncestor(this, false, false) : null;

			if (this.opened) {
				this._opener = getComposedActiveElement();
				this._addAutoCloseHandlers();
				this.dispatchEvent(new CustomEvent('d2l-popover-open', { bubbles: true, composed: true }));
			} else if (changedProperties.get('opened') !== undefined) {
				this._removeAutoCloseHandlers();
				this.dispatchEvent(new CustomEvent('d2l-popover-close', { bubbles: true, composed: true }));
			}

		}
	}

	_addAutoCloseHandlers() {
		this.addEventListener('blur', this._handleAutoCloseFocus, { capture: true });
		document.body.addEventListener('focus', this._handleAutoCloseFocus, { capture: true });
		document.addEventListener('click', this._handleAutoCloseClick, { capture: true });
	}

	_close() {
		const hide = () => {
			this.opened = false;
		};

		hide();
	}

	_handleAutoCloseClick(e) {

		if (!this.opened || this.noAutoClose) return;

		const rootTarget = e.composedPath()[0];
		if (isComposedAncestor(this.shadowRoot.querySelector('.content'), rootTarget)
			|| (this._opener !== document.body && isComposedAncestor(this._opener, rootTarget))) {
			return;
		}

		this._close();
	}

	_handleAutoCloseFocus() {

		// timeout needed to work around lack of support for relatedTarget
		setTimeout(() => {
			// we ignore focusable ancestors othrwise the popover will close when user clicks empty space inside the popover
			if (!this.opened
				|| this.noAutoClose
				|| !document.activeElement
				|| document.activeElement === this._previousFocusableAncestor
				|| document.activeElement === document.body) {
				return;
			}

			const activeElement = getComposedActiveElement();
			if (isComposedAncestor(this.shadowRoot.querySelector('.content'), activeElement)
				|| activeElement === this._opener) {
				return;
			}

			this._close();
		}, 0);

	}

	async _open() {
		this.opened = true;
	}

	_removeAutoCloseHandlers() {
		this.removeEventListener('blur', this._handleAutoCloseFocus, { capture: true });
		document.body?.removeEventListener('focus', this._handleAutoCloseFocus, { capture: true }); // DE41322: document.body can be null in some scenarios
		document.removeEventListener('click', this._handleAutoCloseClick, { capture: true });
	}

	_renderPopover() {
		return html`<div class="content"><slot></slot></div>`;
	}

};
