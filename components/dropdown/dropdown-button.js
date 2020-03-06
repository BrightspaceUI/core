import '../button/button.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DropdownOpenerMixin } from './dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from './dropdown-opener-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class DropdownButton extends DropdownOpenerMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			primary: {
				type: Boolean,
				reflect: true
			},
			text: {
				type: String
			}
		};
	}

	static get styles() {
		return [dropdownOpenerStyles, css`
			d2l-icon {
				height: 0.8rem;
				width: 0.8rem;
				margin-left: 0.6rem;
				pointer-events: none;
			}
			:host([primary]) d2l-icon {
				color: white;
			}
			:host([dir="rtl"]) d2l-icon {
				margin-right: 0.6rem;
				margin-left: 0;
			}
		`];
	}

	constructor() {
		super();
		this.primary = false;
	}

	render() {
		return html`
			<d2l-button ?primary=${this.primary} ?disabled=${this.disabled}>
				${this.text}<d2l-icon icon="tier1:chevron-down"></d2l-icon>
			</d2l-button>
			<slot></slot>
		`;
	}

	/**
	 * Gets the opener element with class "d2l-dropdown-opener" (required by dropdown-opener-mixin).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot.querySelector('d2l-button');
	}

}
customElements.define('d2l-dropdown-button', DropdownButton);
