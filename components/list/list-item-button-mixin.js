import '../colors/colors.js';
import { css, html, nothing } from 'lit';
import { isInteractiveInListItemComposedPath, ListItemMixin } from './list-item-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const ListItemButtonMixin = superclass => class extends ListItemMixin(superclass) {
	static get properties() {
		return {
			/**
			 * Disables the primary action button
			 * @type {boolean}
			 */
			buttonDisabled : { type: Boolean, attribute: 'button-disabled', reflect: true },
			_ariaCurrent: { type: String }
		};
	}

	static get styles() {

		const styles = [ css`
			:host(:not([button-disabled])) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host([button-disabled]) [slot="content-action"] {
				pointer-events: none;
			}
			[slot="outside-control-container"] {
				margin: 0 -12px;
			}
			:host([_list-item-interactive-enabled]) button {
				background-color: transparent;
				border: none;
				color: unset;
				cursor: pointer;
				display: block;
				font-family: unset;
				font-size: unset;
				font-weight: unset;
				height: 100%;
				letter-spacing: unset;
				line-height: unset;
				outline: none;
				padding: 0;
				text-align: start;
				width: 100%;
			}
			/** clean up with flag GAUD-7495-list-interactive-content */
			:host(:not([_list-item-interactive-enabled])) button {
				background-color: transparent;
				border: none;
				cursor: pointer;
				display: block;
				height: 100%;
				outline: none;
				width: 100%;
			}
			/** clean up with flag GAUD-7495-list-interactive-content */
			:host(:not([_list-item-interactive-enabled]):not([button-disabled]):not([no-primary-action])) [slot="content"],
			:host(:not([_list-item-interactive-enabled]):not([no-primary-action])) [slot="control-action"] ~ [slot="content"],
			:host(:not([_list-item-interactive-enabled]):not([no-primary-action])) [slot="outside-control-action"] ~ [slot="content"] {
				pointer-events: none;
			}
			:host(:not([button-disabled])) [slot="control-action"],
			:host(:not([button-disabled])) [slot="outside-control-action"] {
				grid-column-end: control-end;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._primaryActionId = getUniqueId();
		this.buttonDisabled = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._button = this.shadowRoot.querySelector(`#${this._primaryActionId}`);
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('buttonDisabled') && this.buttonDisabled === true) this._hoveringPrimaryAction = false;
	}

	_getDescendantClicked(e) {
		const isPrimaryAction = (elem) => elem === this.shadowRoot.querySelector(`#${this._primaryActionId}`);
		return isInteractiveInListItemComposedPath(e, isPrimaryAction);
	}

	_onButtonClick(e) {
		if (this._getDescendantClicked(e)) {
			e.preventDefault();
		} else {
			/** Dispatched when the item's primary button action is clicked */
			this.dispatchEvent(new CustomEvent('d2l-list-item-button-click', { bubbles: true }));

			if (!this._listItemInteractiveEnabled) return; // clean up with flag GAUD-7495-list-interactive-content

			e.stopPropagation();

			// Dispatches click event from the list item to maintain existing functionality in consumers that listen for the click event
			const listItemClickEvent = new e.constructor(e.type, e);
			listItemClickEvent.preventDefault = () => {
				e.preventDefault();
			};
			/** @ignore */
			this.dispatchEvent(listItemClickEvent);
		}
	}

	_onButtonFocus(e) {
		if (this._getDescendantClicked(e)) {
			requestAnimationFrame(() => this._focusingPrimaryAction = false);
		}
	}

	_renderPrimaryAction(labelledBy, content) {
		return html`<button 
			id="${this._primaryActionId}" 
			aria-current="${ifDefined(this._ariaCurrent)}"
			aria-labelledby="${labelledBy}" 
			@click="${this._onButtonClick}" 
			@focusin="${this._onButtonFocus}"
			?disabled="${this.buttonDisabled}">
			${content || nothing}
		</button>`;
	}

};
