import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { DropdownOpenerMixin } from '../dropdown/dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from '../dropdown/dropdown-opener-styles.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';
import { toolbarButtonStyles } from './toolbar-item-styles.js';
import { ToolbarItemMixin } from './toolbar-item-mixin.js';

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

	static styles = [super.styles, dropdownOpenerStyles, offscreenStyles, toolbarButtonStyles, css`
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
			.tooltip-hidden {
				display: none;
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
		const tooltipClasses = {
			'tooltip-hidden': this.opened,
			'vdiff-target': true
		};
		return html`
			<button
				aria-disabled="${this.disabled ? 'true' : 'false'}"
				aria-label="${this.text}"
				id="opener"
				@keydown="${this.#handleKeyDown}"
				tabindex="${this._activeFocusable ? 0 : -1}"
				type="button">
				<div class="background"></div>
				${this._renderIcon()}
				${this.valueText ? html`<div class="value-text">${this.valueText}</div>` : nothing}
				<d2l-icon icon="tier1:chevron-down-small"></d2l-icon>
			</button>
			<d2l-tooltip class="${classMap(tooltipClasses)}" for="opener">
				<span aria-hidden="true">${this.text}</span>
				<span class="d2l-offscreen">${this.valueText}</span>
			</d2l-tooltip>
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
		if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

		// prevent scroll for up & down keys
		e.preventDefault();

		if ((e.key === 'ArrowDown' && !this.opened) || (e.key === 'ArrowUp' && this.opened)) this.toggleOpen(true);
	}

}

customElements.define('d2l-toolbar-dropdown', ToolbarDropdown);
