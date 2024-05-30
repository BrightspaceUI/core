import '../colors/colors.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../icons/icon.js';
import '../menu/menu.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * Button for sorting a table column in ascending/descending order.
 * @slot - Text of the sort button
 */
export class TableColSortButton extends LocalizeCoreElement(FocusMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Whether sort direction is descending
			 * @type {boolean}
			 */
			desc: {
				reflect: true,
				type: Boolean
			},
			/**
			 * Column is not currently sorted. Hides the ascending/descending sort icon.
			 * @type {boolean}
			 */
			nosort: {
				reflect: true,
				type: Boolean
			},
			/**
			 * The type of data in the column. Used to set the title.
			 *  @type {'words'|'numbers'|'dates'|'unknown'}
			 */
			sourceType: {
				attribute: 'source-type',
				type: String
			},
			_hasDropdownItems: { state: true },
			_selectedMenuItemText: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-table-col-sort-button-additional-padding-inline-end: 0px; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-col-sort-button-width: calc(100% - var(--d2l-table-cell-col-sort-button-size-offset, 4px));
			}
			:host([nosort]) {
				--d2l-table-col-sort-button-additional-padding-inline-end: calc(0.6rem + 18px);
			}
			:host > :first-child {
				width: var(--d2l-table-col-sort-button-width);
			}
			button {
				align-items: center;
				background-color: transparent;
				border: none;
				border-radius: 4px;
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				letter-spacing: inherit;
				line-height: 0.9rem;
				margin-block: 0 var(--d2l-table-cell-col-sort-button-size-offset, 4px);
				margin-inline: 0 var(--d2l-table-cell-col-sort-button-size-offset, 4px);
				padding: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset, 4px));
				padding-inline-end: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset, 4px) + var(--d2l-table-col-sort-button-additional-padding-inline-end));
				text-align: start;
				text-decoration: none;
				width: 100%;
			}
			button::-moz-focus-inner {
				border: 0;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:hover {
				background-color: var(--d2l-color-gypsum);
			}
			button:focus-visible,
			button:${unsafeCSS(getFocusPseudoClass())} {
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				outline-style: none;
			}
			d2l-icon {
				margin-inline-start: 0.6rem;
			}
		`;
	}

	constructor() {
		super();
		this.desc = false;
		this.nosort = false;
		this.sourceType = 'unknown';

		this._describedById = getUniqueId();
		this._hasDropdownItems = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const buttonDescription = this.nosort ? this.localize('components.table-col-sort-button.addSortOrder') : this.localize('components.table-col-sort-button.changeSortOrder');
		const buttonTitle = this.nosort
			? undefined
			: this.localize('components.table-col-sort-button.title', {
				sourceType: this._hasDropdownItems && this._selectedMenuItemText ? 'value' : this.sourceType,
				direction: this.desc ? 'desc' : undefined,
				selectedMenuItemText: this._selectedMenuItemText
			});

		const iconView = !this.nosort ?
			html`<d2l-icon icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}"></d2l-icon>` :
			null;

		const button = html`<button
				aria-describedby="${this._describedById}"
				class="${classMap({ 'd2l-dropdown-opener': this._hasDropdownItems })}"
				title="${ifDefined(buttonTitle)}"
				type="button">
				<slot></slot>${iconView}
			</button><span id="${this._describedById}" hidden>${buttonDescription}</span>`;
		if (this._hasDropdownItems) {
			return html`<d2l-dropdown>
					${button}
					<d2l-dropdown-menu no-pointer align="start" vertical-offset="0">
						<d2l-menu @d2l-menu-item-change="${this._handleMenuItemChange}">
							<slot name="items" @slotchange="${this._handleSlotChange}"></slot>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown>`;
		} else {
			return html`${button}<slot name="items" @slotchange="${this._handleSlotChange}"></slot>`;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		// de-select any selected dropdown menu item
		if (changedProperties.has('nosort') && this.nosort && this._hasDropdownItems) {
			const selectedItem = this.querySelector('[selected]');
			if (selectedItem) selectedItem.selected = false;
		}
	}

	_handleMenuItemChange(e) {
		this._selectedMenuItemText = e.target?.text;
	}

	_handleSlotChange(e) {
		const items = e.target?.assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);
		const filteredItems = items.filter((item) => {
			const role = item.getAttribute('role');
			return (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio');
		});
		this._hasDropdownItems = filteredItems.length > 0;
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);
