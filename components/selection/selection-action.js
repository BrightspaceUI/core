import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from '../button/button-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SelectionActionMixin } from './selection-action-mixin.js';
import { SelectionInfo } from './selection-mixin.js';

/**
 * A button action associated with a selection component.
 * @fires d2l-selection-action-click - Dispatched when the user clicks the action button. The `SelectionInfo` is provided as the event `detail`. If `requires-selection` was specified then the event will only be dispatched if items are selected.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class Action extends FocusMixin(LocalizeCoreElement(SelectionActionMixin(ButtonMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Preset icon key (e.g. `tier1:gear`)
			 * @type {string}
			 */
			icon: { type: String, reflect: true },
			/**
			 * REQUIRED: The text for the action
			 * @type {string}
			 */
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static get focusElementSelector() {
		return 'd2l-button-subtle';
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-button-ghost-click', this._handleActionClick);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-button-ghost-click', this._handleActionClick);
	}

	render() {
		return html`
			<d2l-button-subtle
				@click="${this._handleActionClick}"
				?disabled="${this.disabled}"
				disabled-tooltip="${ifDefined(this.disabled ? this.localize('components.selection.action-hint') : undefined)}"
				icon="${ifDefined(this.icon)}"
				text="${this.text}">
			</d2l-button-subtle>
		`;
	}

	_handleActionClick(e) {
		e.stopPropagation();

		if (this.requiresSelection && this.selectionInfo.state === SelectionInfo.states.none) return;

		this.dispatchEvent(new CustomEvent('d2l-selection-action-click', {
			bubbles: true,
			detail: this.selectionInfo
		}));
	}

}

customElements.define('d2l-selection-action', Action);
