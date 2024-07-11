import '../colors/colors.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html } from 'lit';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
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
			/**
			 * Whether to disable auto-focus on the first focusable element when opened
			 * @type {boolean}
			 */
			noAutoFocus: { type: Boolean, reflect: true, attribute: 'no-auto-focus' },
			_useNativePopover: { type: String, reflect: true, attribute: 'popover' }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-popover-default-animation-name: d2l-popover-animation;
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

			@keyframes d2l-popover-animation {
				0% { opacity: 0; transform: translate(0, -10px); }
				100% { opacity: 1; transform: translate(0, 0); }
			}
			@media (prefers-reduced-motion: no-preference) {
				:host([opened]) {
					animation: var(--d2l-popover-animation-name, var(--d2l-popover-default-animation-name)) 6000ms ease;
				}
			}
		`;
	}

	constructor() {
		super();
		this.noAutoClose = false;
		this.noAutoFocus = false;
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
		this._clearDismissible();
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
				this._dismissibleId = setDismissible(() => this.close());
				this._focusContent(this);
				this.dispatchEvent(new CustomEvent('d2l-popover-open', { bubbles: true, composed: true }));

			} else if (changedProperties.get('opened') !== undefined) {

				this._removeAutoCloseHandlers();
				this._clearDismissible();
				this._focusOpener();
				this.dispatchEvent(new CustomEvent('d2l-popover-close', { bubbles: true, composed: true }));

			}

		}
	}

	close() {
		this.opened = false;
		return this.updateComplete;
	}

	open(applyFocus = true) {
		this._applyFocus = applyFocus !== undefined ? applyFocus : true;
		this.opened = true;
		return this.updateComplete;
	}

	toggleOpen(applyFocus = true) {
		if (this.opened) return this.close();
		else return this.open(!this.noAutoFocus && applyFocus);
	}

	_addAutoCloseHandlers() {
		this.addEventListener('blur', this._handleAutoCloseFocus, { capture: true });
		document.body.addEventListener('focus', this._handleAutoCloseFocus, { capture: true });
		document.addEventListener('click', this._handleAutoCloseClick, { capture: true });
	}

	_clearDismissible() {
		if (!this._dismissibleId) return;
		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;
	}

	_focusContent(container) {
		if (this.noAutoFocus || !this._applyFocus) return;

		const focusable = getFirstFocusableDescendant(container);
		if (focusable) {
			// Removing the rAF call can allow infinite focus looping to happen in content using a focus trap
			requestAnimationFrame(() => focusable.focus());
		} else {
			const content = this._getContentContainer();
			content.setAttribute('tabindex', '-1');
			content.focus();
		}
	}

	_focusOpener() {
		if (!document.activeElement) return;
		if (!isComposedAncestor(this, getComposedActiveElement())) return;

		this?._opener.focus();
	}

	_getContentContainer() {
		return this.shadowRoot.querySelector('.content');
	}

	_handleAutoCloseClick(e) {

		if (!this.opened || this.noAutoClose) return;

		const rootTarget = e.composedPath()[0];
		if (isComposedAncestor(this._getContentContainer(), rootTarget)
			|| (this._opener !== document.body && isComposedAncestor(this._opener, rootTarget))) {
			return;
		}

		this.close();
	}

	_handleAutoCloseFocus() {

		// todo: try to use relatedTarget instead - this logic is largely copied as-is from dropdown simply to mitigate risk of this fragile code
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
			if (isComposedAncestor(this._getContentContainer(), activeElement)
				|| activeElement === this._opener) {
				return;
			}

			this.close();
		}, 0);

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
