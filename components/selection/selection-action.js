import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from '../button/button-mixin.js';
import { buttonStyles } from '../button/button-styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { selectionStates } from './selection-mixin.js';
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
		return [labelStyles, buttonStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			button {
				background-color: transparent;
				border-color: transparent;
				font-family: inherit;
				padding: 0.55rem 0.6rem;
				position: relative;
			}

			:host([h-align="text"]) button {
				left: -0.6rem;
			}
			:host([dir="rtl"][h-align="text"]) button {
				left: 0;
				right: -0.6rem;
			}

			/* Firefox includes a hidden border which messes up button dimensions */
			button::-moz-focus-inner {
				border: 0;
			}
			button[disabled]:hover,
			button[disabled]:focus,
			:host([active]) button[disabled] {
				background-color: transparent;
			}
			button:hover,
			button:focus,
			:host([active]) button {
				background-color: var(--d2l-color-gypsum);
			}

			.d2l-selection-action-content {
				color: var(--d2l-color-celestine);
				vertical-align: middle;
			}
			button:hover:not([disabled]) .d2l-selection-action-content,
			button:focus:not([disabled]) .d2l-selection-action-content,
			:host([active]:not([disabled])) button .d2l-selection-action-content {
				color: var(--d2l-color-celestine-minus-1);
			}
			:host([icon]) .d2l-selection-action-content {
				padding-left: 1.2rem;
			}
			:host([icon][icon-right]) .d2l-selection-action-content {
				padding-left: 0;
				padding-right: 1.2rem;
			}

			:host([dir="rtl"][icon]) .d2l-selection-action-content {
				padding-left: 0;
				padding-right: 1.2rem;
			}

			:host([dir="rtl"][icon][icon-right]) .d2l-selection-action-content {
				padding-left: 1.2rem;
				padding-right: 0;
			}

			d2l-icon.d2l-selection-action-icon {
				color: var(--d2l-color-celestine);
				display: none;
				height: 0.9rem;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				width: 0.9rem;
			}
			button:hover:not([disabled]) d2l-icon.d2l-selection-action-icon,
			button:focus:not([disabled]) d2l-icon.d2l-selection-action-icon,
			:host([active]:not([disabled])) button d2l-icon.d2l-selection-action-icon {
				color: var(--d2l-color-celestine-minus-1);
			}
			:host([icon]) d2l-icon.d2l-selection-action-icon {
				display: inline-block;
			}
			:host([icon][icon-right]) d2l-icon.d2l-selection-action-icon {
				right: 0.6rem;
			}
			:host([dir="rtl"][icon][icon-right]) d2l-icon.d2l-selection-action-icon {
				left: 0.6rem;
				right: auto;
			}

			.d2l-selection-action-non-interactive,
			button[disabled] {
				cursor: default;
				opacity: 0.5;
			}
		`];
	}

	render() {
		const classes = {
			'd2l-label-text': true,
			'd2l-selection-action-non-interactive': (this.requiresSelection && this.selectionInfo.state === selectionStates.none)
		};

		const tooltip = (this.requiresSelection && this.selectionInfo.state === selectionStates.none)
			? html`<d2l-tooltip for="action" delay="600">${this.localize('components.selection.action-hint')}</d2l-tooltip>` : '';

		return html`
			<button
				class="${classMap(classes)}"
				@click="${this._handleActionClick}"
				?disabled="${this.disabled}"
				id="action">
				${this.icon ? html`<d2l-icon icon="${this.icon}" class="d2l-selection-action-icon"></d2l-icon>` : ''}
				<span class="d2l-selection-action-content">${this.text}</span>
			</button>
			${tooltip}
		`;
	}

	_handleActionClick(e) {
		e.stopPropagation();

		if (this.requiresSelection && this.selectionInfo.state === selectionStates.none) return;

		this.dispatchEvent(new CustomEvent('d2l-selection-action-click', {
			bubbles: true,
			detail: this.selectionInfo
		}));
	}

}

customElements.define('d2l-selection-action', Action);
