import '../button/button-subtle.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from '../button/button-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionInfoController } from './selection-info-controller.js';

/**
 * An action associated with a selection component.
 * @fires d2l-selection-action-click - Dispatched when the user clicks the action; provides the selection info
 */
class Action extends LocalizeCoreElement(ButtonMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Preset icon key (e.g. "tier1:gear")
			 */
			icon: { type: String, reflect: true },
			/**
			 * Whether the action requires one or more selected items
			 */
			requiresSelection: { type: Boolean, attribute: 'requires-selection', reflect: true },
			/**
			 * REQUIRED: The text for the action
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

	constructor() {
		super();
		this._selectionInfo = new SelectionInfoController(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-button-ghost-click', this._handleActionClick);
		this._selectionInfo.hostConnected(); // remove with Lit 2
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-button-ghost-click', this._handleActionClick);
		this._selectionInfo.hostDisconnected(); // remove with Lit 2
	}

	render() {
		const nonInteractive = (this.requiresSelection && this._selectionInfo.state === SelectionInfo.states.none);
		return html`
			<d2l-button-subtle
				@click="${this._handleActionClick}"
				?disabled="${this.disabled || nonInteractive}"
				disabled-tooltip="${ifDefined(nonInteractive ? this.localize('components.selection.action-hint') : undefined)}"
				icon="${ifDefined(this.icon)}"
				text="${this.text}">
			</d2l-button-subtle>
		`;
	}

	_handleActionClick(e) {
		e.stopPropagation();

		if (this.requiresSelection && this._selectionInfo.state === SelectionInfo.states.none) return;

		this.dispatchEvent(new CustomEvent('d2l-selection-action-click', {
			bubbles: true,
			detail: {
				keys: this._selectionInfo.keys,
				state: this._selectionInfo.state
			}
		}));
	}

}

customElements.define('d2l-selection-action', Action);
