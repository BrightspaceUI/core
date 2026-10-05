import { css, html, LitElement, nothing } from 'lit';
import { DropdownOpenerMixin } from '../dropdown/dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from '../dropdown/dropdown-opener-styles.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';
import { toolbarButtonStyles } from './toolbar-item-styles.js';
import { ToolbarItemMixin } from './toolbar-item-mixin.js';

const keyCodes = Object.freeze({
	UP: 38,
	DOWN: 40
});

/**
 * A toolbar button that opens a dropdown
 */
class ToolbarDropdown extends FocusMixin(DropdownOpenerMixin(SlottedIconMixin(ToolbarItemMixin(ThemeMixin(PropertyRequiredMixin(LitElement)))))) {

	static properties = {
		/**
		 * Disables the toolbar button
		 * @type {boolean}
		 */
		disabled: { type: Boolean },
		/**
		 * ACCESSIBILITY: REQUIRED: Accessible text for the button
		 * @type {string}
		 */
		text: { type: String, required: true },
		/**
		 * Text describing the value
		 * @type {string}
		 */
		valueText: { type: String, attribute: 'value-text' }
	};

	static styles = [super.styles, dropdownOpenerStyles, toolbarButtonStyles, css`
			:host {
				font-size: 1rem;
			}
			button {
				align-items: center;
				display: flex;
				font-size: 0.7rem;
				gap: 3px;
				justify-content: center;
				overflow: hidden;
				padding-inline: 6px 4px;
				text-align: start;
				width: 100%;
			}
			button > .value-text {
				flex: auto;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			button[aria-expanded="true"] .background {
				background-color: var(--d2l-theme-background-color-interactive-secondary-default);
				transform: scale(1, 1);
			}
			:host([theme="dark"]) button[aria-expanded="true"] .background {
				background-color: var(--d2l-color-tungsten);
				transform: scale(1, 1);
			}
	`];

	constructor() {
		super();
		this.disabled = false;
		this.text = '';
	}

	static get focusElementSelector() {
		return 'button';
	}

	get opened() {
		return this.dropdownOpened;
	}

	render() {
		return html`
			<button
				aria-disabled="${this.disabled ? 'true' : 'false'}"
				aria-describedby="${ifDefined(this.valueText ? 'valueText' : undefined)}"
				aria-label="${this.text}"
				@keydown="${this.#handleKeyDown}"
				tabindex="${this._activeFocusable ? 0 : -1}"
				title="${this.text}"
				type="button">
				<div class="background"></div>
				${this._renderIcon()}
				${this.valueText ? html`<div id="valueText" class="value-text">${this.valueText}</div>` : nothing}
				<d2l-icon icon="tier1:chevron-down-small"></d2l-icon>
			</button>
			<slot></slot>
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('disabled') && this.disabled && this.opened) {
			this.closeDropdown(false);
		}
	}

	/**
	 * Gets the "button" opener element (required by dropdown-opener-mixin).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot?.querySelector('button');
	}

	#handleKeyDown(e) {
		if (e.keyCode !== keyCodes.UP && e.keyCode !== keyCodes.DOWN) return;

		// prevent scroll for up & down keys
		e.preventDefault();

		if ((e.keyCode === keyCodes.DOWN && !this.opened) || (e.keyCode === keyCodes.UP && this.opened)) this.toggleOpen(true);
	}

}

customElements.define('d2l-toolbar-dropdown', ToolbarDropdown);
