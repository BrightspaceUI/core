import '../colors/colors.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../icons/icon.js';
import '../menu/menu.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * Button for sorting a table column in ascending/descending order.
 * @slot - Text of the sort button
 */
export class TableColSortButton extends RtlMixin(LocalizeCoreElement(FocusMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * The type of data in the column.
			 *  @type {'words'|'numbers'|'dates'}
			 */
			dataType: {
				attribute: 'data-type',
				type: String
			},
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
			_hasDropdownItems: { state: true },
			_selectedMenuItemText: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-table-col-sort-button-border-width: 2px;
				--d2l-table-col-sort-button-border: var(--d2l-table-col-sort-button-border-width) solid transparent;
				--d2l-table-col-sort-button-border-radius: 0;
				--d2l-table-col-sort-button-box-shadow: none;
				--d2l-table-col-sort-button-padding-offset: var(--d2l-table-col-sort-button-border-width);
				--d2l-table-col-sort-button-padding: calc(var(--d2l-table-cell-padding) - var(--d2l-table-col-sort-button-padding-offset));
				--d2l-table-col-sort-button-size-offset: 0px; /* stylelint-disable-line length-zero-no-unit */ /* when type="light" button bumps in by 4px */
				--d2l-table-col-sort-button-height: calc(100% - 2 * var(--d2l-table-col-sort-button-size-offset));
				--d2l-table-col-sort-button-width: calc(100% - 2 * var(--d2l-table-col-sort-button-size-offset));
				--d2l-table-col-sort-button-bottom-left-radius: var(--d2l-table-col-sort-button-border-radius);
				--d2l-table-col-sort-button-bottom-right-radius: var(--d2l-table-col-sort-button-border-radius);
				--d2l-table-col-sort-button-top-left-radius: var(--d2l-table-col-sort-button-border-radius);
				--d2l-table-col-sort-button-top-right-radius: var(--d2l-table-col-sort-button-border-radius);
			}
			:host > :first-child {
				height: var(--d2l-table-col-sort-button-height);
				width: var(--d2l-table-col-sort-button-width);
			}
			button {
				align-items: center;
				background-color: transparent;
				border: var(--d2l-table-col-sort-button-border);
				border-radius: var(--d2l-table-col-sort-button-border-radius);
				border-bottom-left-radius: var(--d2l-table-col-sort-button-bottom-left-radius);
				border-bottom-right-radius: var(--d2l-table-col-sort-button-bottom-right-radius);
				border-top-left-radius: var(--d2l-table-col-sort-button-top-left-radius);
				border-top-right-radius: var(--d2l-table-col-sort-button-top-right-radius);
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				height: 100%;
				letter-spacing: inherit;
				margin-inline-start: var(--d2l-table-col-sort-button-size-offset);
				padding: var(--d2l-table-col-sort-button-padding);
				text-align: left;
				text-decoration: none;
				width: 100%;
			}
			:host([dir="rtl"]) button {
				text-align: right;
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
				border-color: var(--d2l-color-celestine);
				box-shadow: var(--d2l-table-col-sort-button-box-shadow);
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
				dataType: this._hasDropdownItems && this._selectedMenuItemText ? 'value' : this.dataType,
				direction: this.desc ? 'desc' : undefined,
				selectedMenuItemText: this._selectedMenuItemText
			});
		const iconView = !this.nosort ?
			html`<d2l-icon icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}"></d2l-icon>` :
			null;

		const button = html`<button class="${classMap({ 'd2l-dropdown-opener': this._hasDropdownItems })}" type="button" title="${ifDefined(buttonTitle)}" aria-description="${buttonDescription}">
			<slot></slot>${iconView}
		</button>`;
		const buttonOnlyRender = !this._hasDropdownItems
			? html`${button}<slot name="items" @slotchange="${this._handleSlotChange}"></slot>`
			: null;
		const dropdownButtonRender = this._hasDropdownItems ? html`
			<d2l-dropdown>
				${button}
				<d2l-dropdown-menu id="dropdown" no-pointer align="start" vertical-offset="5">
					<d2l-menu @d2l-menu-item-change="${this._handleMenuItemChange}">
						<slot name="items" @slotchange="${this._handleSlotChange}"></slot>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		` : null;

		return dropdownButtonRender || buttonOnlyRender;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('dataType')) {
			if (this.dataType !== 'words' && this.dataType !== 'numbers' && this.dataType !== 'dates' && this.dataType !== undefined) {
				console.warn('d2l-table-col-sort-button: data-type attribute has been set to an invalid value.');
			}
		}

		// de-select any selected dropdown menu item
		if (changedProperties.has('nosort') && this.nosort && this._hasDropdownItems) {
			const selectedItem = this.querySelector('[selected]');
			if (selectedItem) selectedItem.selected = false;
		}
	}

	_handleMenuItemChange(e) {
		const buttonText = e.target?.text;
		if (buttonText) this._selectedMenuItemText = buttonText;
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
