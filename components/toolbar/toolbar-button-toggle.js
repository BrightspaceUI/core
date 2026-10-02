import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';
import { toolbarButtonStyles } from './toolbar-item-styles.js';
import { ToolbarItemMixin } from './toolbar-item-mixin.js';

/**
 * A toolbar toggle button that performs an action and supports pressed and expanded states
 */
class ToolbarButtonToggle extends SlottedIconMixin(FocusMixin(ToolbarItemMixin(ThemeMixin(PropertyRequiredMixin(LitElement))))) {

	static properties = {
		/**
		 * Disables the toolbar button
		 * @type {boolean}
		 */
		disabled: { type: Boolean },
		/**
		 * Expandable state
		 * @type {boolean}
		 */
		expandable: { type: Boolean },
		/**
		 * Expanded state
		 * @type {boolean}
		 */
		expanded: { type: Boolean },
		/**
		 * Pressed state
		 * @type {boolean}
		 */
		pressed: { type: Boolean },
		/**
		 * ACCESSIBILITY: REQUIRED: Accessible text for the button
		 * @type {string}
		 */
		text: { type: String, required: true }
	};

	static styles = [super.styles, toolbarButtonStyles, css`
		button[aria-pressed="true"] > .background {
			background-color: var(--d2l-color-celestine-plus-2);
			transform: scale(1, 1);
		}
		button[aria-pressed="true"]:hover > .background {
			background-color: #dbf5ff; /* not a daylight color */
		}
		button[aria-pressed="true"] ::slotted(d2l-icon-custom),
		button[aria-pressed="true"] d2l-icon {
			fill: var(--d2l-color-celestine);
		}
		:host([theme="dark"]) button[aria-pressed="true"] > .background,
		:host([theme="dark"]) button[aria-pressed="true"]:hover > .background {
			background-color: var(--d2l-color-tungsten);
		}
		:host([theme="dark"]) button[aria-pressed="true"] ::slotted(d2l-icon-custom),
		:host([theme="dark"]) button[aria-pressed="true"] d2l-icon {
			fill: var(--d2l-color-regolith);
		}
	`];

	constructor() {
		super();
		this.disabled = false;
		this.expandable = false;
		this.expanded = false;
		this.pressed = false;
		this.text = '';
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		return html`
			<button
				aria-disabled="${this.disabled ? 'true' : 'false'}"
				aria-expanded="${ifDefined(this.expandable ? (this.expanded ? 'true' : 'false') : undefined)}"
				aria-label="${this.text}"
				aria-pressed="${ifDefined(!this.expandable ? (this.pressed ? 'true' : 'false') : undefined)}"
				@click="${this.#handleClick}"
				tabindex="${this._activeFocusable ? 0 : -1}"
				title="${this.text}"
				type="button">
				<div class="background"></div>
				${this._renderIcon()}
			</button>
		`;
	}

	#handleClick(e) {
		e.stopPropagation();
		if (this.disabled) return;

		if (this.expandable) {
			this.expanded = !this.expanded;
		} else {
			this.pressed = !this.pressed;
		}

		/** Dispatched when the pressed state changes. */
		this.dispatchEvent(new CustomEvent('d2l-toolbar-button-toggle-change'));
	}

}

customElements.define('d2l-toolbar-button-toggle', ToolbarButtonToggle);
