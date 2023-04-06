import '../button/button-icon.js';
import { css, html, LitElement } from 'lit';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor/visible-on-ancestor-mixin.js';
import { DropdownOpenerMixin } from './dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from './dropdown-opener-styles.js';

/**
 * A simple/minimal opener for dropdown content.
 * @slot - Dropdown content (e.g., "d2l-dropdown-content", "d2l-dropdown-menu" or "d2l-dropdown-tabs")
 */
class DropdownContextMenu extends DropdownOpenerMixin(VisibleOnAncestorMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Label for the context-menu button
			 * @type {string}
			 */
			text: {
				type: String
			},

			/**
			 * Attribute for busy/rich backgrounds
			 * @type {boolean}
			 */
			translucent: {
				type: Boolean
			},
		};
	}

	static get styles() {
		return [dropdownOpenerStyles, visibleOnAncestorStyles, css`
			:host {
				display: inline-block;
			}
		`];
	}
	constructor() {
		super();
		this.translucent = false;
	}

	render() {
		return html`
			<d2l-button-icon ?disabled=${this.disabled} icon="tier1:chevron-down" text=${this.text} ?translucent=${this.translucent}>
			</d2l-button-icon>
			<slot></slot>
		`;
	}

	/**
	 * Gets the "d2l-button-icon" opener element (required by dropdown-opener-mixin).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot && this.shadowRoot.querySelector('d2l-button-icon');
	}

}
customElements.define('d2l-dropdown-context-menu', DropdownContextMenu);
