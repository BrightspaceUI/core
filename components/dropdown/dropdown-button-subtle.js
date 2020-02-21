import '../button/button-subtle.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownOpenerMixin } from './dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from './dropdown-opener-styles.js';

class DropdownButtonSubtle extends DropdownOpenerMixin(LitElement) {

	static get properties() {
		return {
			text: {
				type: String
			}
		};
	}

	static get styles() {
		return dropdownOpenerStyles;
	}

	render() {
		return html`
			<d2l-button-subtle text=${this.text} icon="tier1:chevron-down" icon-right></d2l-button-subtle>
			<slot></slot>
		`;
	}

	/**
	 * Gets the opener element with class "d2l-dropdown-opener" (required by dropdown-opener-mixin).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot.querySelector('d2l-button-subtle');
	}

}
customElements.define('d2l-dropdown-button-subtle', DropdownButtonSubtle);
