import '../colors/colors.js';
import { css, html } from 'lit';

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
			_useNativePopover: { type: Boolean, reflect: true, attribute: 'popover' }
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
		this.opened = false;
		this._useNativePopover = isSupported;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('opened')) {

			if (this.opened) {
				this.dispatchEvent(new CustomEvent('d2l-popover-open', { bubbles: true, composed: true }));
			} else if (changedProperties.get('opened') !== undefined) {
				this.dispatchEvent(new CustomEvent('d2l-popover-close', { bubbles: true, composed: true }));
			}

			if (this._useNativePopover) {
				if (this.opened) this.showPopover();
				else this.hidePopover();
			}

		}
	}

	_renderPopover() {
		return html`<div class="content"><slot></slot></div>`;
	}

};
