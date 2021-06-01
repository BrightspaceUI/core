import '../button/button-subtle.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from '../button/button-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionSubscriberMixin } from './selection-subscriber-mixin.js';

/**
 * An action associated with a selection component.
 * @fires d2l-selection-action-click - Dispatched when the user clicks the action; provides the selection info
 */
class Action extends LocalizeCoreElement(SelectionSubscriberMixin(ButtonMixin(RtlMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Preset icon key (e.g. "tier1:gear")
			 */
			icon: { type: String, reflect: true },
			/**
			 * Indicates whether the action is only focusable
			 */
			nonInteractive: { type: Boolean, attribute: 'non-interactive', reflect: true },
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

	get selectionInfo() {
		return super.selectionInfo;
	}

	set selectionInfo(value) {
		super.selectionInfo = value;
		this.nonInteractive = (this.requiresSelection && this.selectionInfo.state === SelectionInfo.states.none);
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
				?disabled="${this.disabled || this.nonInteractive}"
				disabled-tooltip="${ifDefined(this.nonInteractive ? this.localize('components.selection.action-hint') : undefined)}"
				icon="${ifDefined(this.icon)}"
				text="${this.text}">
			</d2l-button-subtle>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('nonInteractive')) return;

		this.dispatchEvent(new CustomEvent('d2l-non-interactive-change', {
			composed: true,
			bubbles: true
		}));
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
