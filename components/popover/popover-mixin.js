import '../colors/colors.js';
import '../focus-trap/focus-trap.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html } from 'lit';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { classMap } from 'lit/directives/class-map.js';
import { isComposedAncestor } from '../../helpers/dom.js';
import { styleMap } from 'lit/directives/style-map.js';

const isSupported = ('popover' in HTMLElement.prototype);

// eslint-disable-next-line no-console
console.log('Popover', isSupported);

export const PopoverMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_noAutoClose: { state: true },
			_noAutoFit: { state: true },
			_noAutoFocus: { state: true },
			_opened: { type: Boolean, reflect: true, attribute: '_opened' },
			_trapFocus: { state: true },
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
				margin: 0;
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
			:host([_opened]) {
				display: inline-block;
			}

			.content-container {
				background-color: var(--d2l-popover-background-color, var(--d2l-popover-default-background-color));
				border: 1px solid var(--d2l-popover-border-color, var(--d2l-popover-default-border-color));
				border-radius: var(--d2l-popover-border-radius, var(--d2l-popover-default-border-radius));
				box-shadow: var(--d2l-popover-shadow, var(--d2l-popover-default-shadow));
				box-sizing: border-box;
				outline: none;
			}

			@keyframes d2l-popover-animation {
				0% { opacity: 0; transform: translate(0, -10px); }
				100% { opacity: 1; transform: translate(0, 0); }
			}
			@media (prefers-reduced-motion: no-preference) {
				:host([_opened]) {
					animation: var(--d2l-popover-animation-name, var(--d2l-popover-default-animation-name)) 300ms ease;
				}
			}
		`;
	}

	constructor() {
		super();
		this.configure();
		this._useNativePopover = isSupported ? 'manual' : undefined;
	}

	connectedCallback() {
		super.connectedCallback();
		if (this._opened) this.#addAutoCloseHandlers();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#removeAutoCloseHandlers();
		this.#clearDismissible();
	}

	async close() {
		if (!this._opened) return;

		this._opened = false;

		if (this._useNativePopover) this.hidePopover();

		this._previousFocusableAncestor = null;
		this.#removeAutoCloseHandlers();
		this.#clearDismissible();
		await this.updateComplete; // wait before applying focus to opener
		this.#focusOpener();
		this.dispatchEvent(new CustomEvent('d2l-popover-close', { bubbles: true, composed: true }));
	}

	configure(properties) {
		this._noAutoClose = properties?.noAutoClose ?? false;
		this._noAutoFit = properties?.noAutoFit ?? false;
		this._noAutoFocus = properties?.noAutoFocus ?? false;
		this._trapFocus = properties?.trapFocus ?? false;
	}

	async open(applyFocus = true) {
		if (this._opened) return;

		this._applyFocus = applyFocus !== undefined ? applyFocus : true;
		this._opened = true;

		await this.updateComplete; // wait for popover attribute before managing top-layer
		if (this._useNativePopover) this.showPopover();

		this._previousFocusableAncestor = getPreviousFocusableAncestor(this, false, false);

		this._opener = getComposedActiveElement();
		this.#addAutoCloseHandlers();

		await this.#position();

		this._dismissibleId = setDismissible(() => this.close());

		this.#focusContent(this);

		this.dispatchEvent(new CustomEvent('d2l-popover-open', { bubbles: true, composed: true }));
	}

	renderPopover(content) {

		/*
		<div
		id="d2l-dropdown-wrapper"
		class="d2l-dropdown-content-width vdiff-target"
		style=${styleMap(widthStyle)}
		?data-closing="${this._closing}">
		*/

		content = html`<div class="content-container vdiff-target">${content}</div>`;

		if (this._trapFocus) {
			content = html`
				<d2l-focus-trap @d2l-focus-trap-enter="${this.#handleFocusTrapEnter}" ?trap="${this._opened}">
					${content}
				</d2l-focus-trap>
			`;
		}

		const positionStyle = {};
		/*
		if (this._position) {
			for (const prop in this._position) {
				positionStyle[prop] = `${this._position[prop]}px`;
			}
		}
		*/

		content = html`
			<div class="content-position" style=${styleMap(positionStyle)}>
				${content}
			</div>
		`;

		return content;
	}

	toggleOpen(applyFocus = true) {
		if (this._opened) return this.close();
		else return this.open(!this._noAutoFocus && applyFocus);
	}

	#handleAutoCloseClick = (e) => {

		if (!this._opened || this._noAutoClose) return;

		const rootTarget = e.composedPath()[0];
		if (isComposedAncestor(this.#getContentContainer(), rootTarget)
			|| (this._opener !== document.body && isComposedAncestor(this._opener, rootTarget))) {
			return;
		}

		this.close();
	};

	#handleAutoCloseFocus = () => {

		// todo: try to use relatedTarget instead - this logic is largely copied as-is from dropdown simply to mitigate risk of this fragile code
		setTimeout(() => {
			// we ignore focusable ancestors othrwise the popover will close when user clicks empty space inside the popover
			if (!this._opened
				|| this._noAutoClose
				|| !document.activeElement
				|| document.activeElement === this._previousFocusableAncestor
				|| document.activeElement === document.body) {
				return;
			}

			const activeElement = getComposedActiveElement();
			if (isComposedAncestor(this, activeElement)
				|| activeElement === this._opener) {
				return;
			}

			this.close();
		}, 0);

	};

	#addAutoCloseHandlers() {
		this.addEventListener('blur', this.#handleAutoCloseFocus, { capture: true });
		document.body.addEventListener('focus', this.#handleAutoCloseFocus, { capture: true });
		document.addEventListener('click', this.#handleAutoCloseClick, { capture: true });
	}

	#clearDismissible() {
		if (!this._dismissibleId) return;
		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;
	}

	#focusContent(container) {
		if (this._noAutoFocus || this._applyFocus === false) return;

		const focusable = getFirstFocusableDescendant(container);
		if (focusable) {
			// Removing the rAF call can allow infinite focus looping to happen in content using a focus trap
			requestAnimationFrame(() => focusable.focus());
		} else {
			const content = this.#getContentContainer();
			content.setAttribute('tabindex', '-1');
			content.focus();
		}
	}

	#focusOpener() {
		if (!document.activeElement) return;
		if (!isComposedAncestor(this, getComposedActiveElement())) return;

		this?._opener.focus();
	}

	#getContentContainer() {
		return this.shadowRoot.querySelector('.content-container');
	}

	#handleFocusTrapEnter() {
		this.#focusContent(this.#getContentContainer());

		/** Dispatched when user focus enters the popover (trap-focus option only) */
		this.dispatchEvent(new CustomEvent('d2l-popover-focus-enter', { detail: { applyFocus: this._applyFocus } }));
	}

	async #position(contentRect, options) {
		if (!this._opener) return;

		options = Object.assign({ updateAboveBelow: true, updateHeight: true }, options);

		const content = this.#getContentContainer();

		/*
		// don't let dropdown content horizontally overflow viewport
		this._width = null;

		const openerPosition = window.getComputedStyle(opener, null).getPropertyValue('position'); // todo: cleanup when switched to fixed positioning
		const boundingContainer = getBoundingAncestor(target.parentNode);
		const boundingContainerRect = boundingContainer.getBoundingClientRect(); // todo: cleanup when switched to fixed positioning
		const scrollHeight = boundingContainer.scrollHeight;

		await this.updateComplete;
		*/

		console.log(content.scrollWidth);
		console.log(content.getBoundingClientRect());

		//const scrollWidth = Math.max(header.scrollWidth, content.scrollWidth, footer.scrollWidth);
		//const availableWidth = (bounded ? boundingContainerRect.width - 60 : window.innerWidth - 40);
		//this._width = (availableWidth > scrollWidth ? scrollWidth : availableWidth) ;

		//await this.updateComplete;



	}

	#removeAutoCloseHandlers() {
		this.removeEventListener('blur', this.#handleAutoCloseFocus, { capture: true });
		document.body?.removeEventListener('focus', this.#handleAutoCloseFocus, { capture: true }); // DE41322: document.body can be null in some scenarios
		document.removeEventListener('click', this.#handleAutoCloseClick, { capture: true });
	}

};
