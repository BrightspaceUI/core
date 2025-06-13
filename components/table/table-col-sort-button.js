import '../colors/colors.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../icons/icon.js';
import '../menu/menu.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusRingStyles } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * Button for sorting a table column in ascending/descending order.
 * @fires click - Dispatched when the button is clicked
 * @slot - Text of the sort button
 * @slot items - Multi-facted sort items. Generally assigned to the slot attribute on a nested d2l-table-col-sort-button-item.
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
			 * Position of the button content
			 * @type {'start'|'center'|'end'}
			 */
			position: {
				reflect: true,
				type: String
			},
			/**
			 * ACCESSIBILITY: The type of data in the column (e.g., 'words'). Used to set the title.
			 *  @type {'words'|'numbers'|'dates'|'unknown'}
			 */
			sourceType: {
				attribute: 'source-type',
				type: String
			},
			_hasDropdownItems: { state: true },
			_selectedMenuItemText: { state: true },
			_label: { state: true },
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-table-col-sort-button-additional-padding-inline-end: 0px; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-col-sort-button-additional-padding-inline-start: 0px; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-col-sort-button-width: calc(100% - var(--d2l-table-cell-col-sort-button-size-offset, 4px));
			}
			:host([nosort]) {
				--d2l-table-col-sort-button-additional-padding-inline-end: calc(0.6rem + 18px);
			}
			:host > :first-child {
				width: var(--d2l-table-col-sort-button-width);
			}
			:host([nosort][position="center"]) {
				--d2l-table-col-sort-button-additional-padding-inline-end: calc(0.5 * (0.6rem + 18px) + var(--d2l-table-cell-col-sort-button-size-offset, 4px));
				--d2l-table-col-sort-button-additional-padding-inline-start: calc(0.5 * (0.6rem + 18px) - var(--d2l-table-cell-col-sort-button-size-offset, 4px));
			}
			:host([nosort][position="end"]) {
				--d2l-table-col-sort-button-additional-padding-inline-end: 0px; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-col-sort-button-additional-padding-inline-start: calc(0.6rem + 18px);
			}
			:host([position="center"]) button {
				justify-content: center;
			}
			:host([position="end"]) button {
				justify-content: end;
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
				padding-inline-start: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset, 4px) + var(--d2l-table-col-sort-button-additional-padding-inline-start));
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
			${getFocusRingStyles('button', { extraStyles: css`box-shadow: 0 0 0 2px #ffffff;` })}
			d2l-icon {
				margin-inline-start: 0.6rem;
			}
			::slotted(*[slot="items"]) {
				display: none;
			}
			::slotted(d2l-table-col-sort-button-item[slot="items"]) {
				display: flex;
			}
		`;
	}

	constructor() {
		super();
		this.desc = false;
		this.nosort = false;
		this.position = 'start';
		this.sourceType = 'unknown';

		this._describedById = getUniqueId();
		this._describedBySortedId = getUniqueId();
		this._hasDropdownItems = false;
		this._label = '';
	}

	static get focusElementSelector() {
		return 'button';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const selectedItem = this.querySelector('[selected]');
		if (selectedItem && !this.nosort) this._selectedMenuItemText = selectedItem.text;
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

		let sortedView = nothing;
		let describedBy = this._describedById;
		if (buttonTitle !== undefined) {
			sortedView = html`<span id="${this._describedBySortedId}" hidden>${buttonTitle},</span>`;
			describedBy = `${this._describedBySortedId} ${this._describedById}`;
		}

		const button = html`<button
				aria-describedby="${describedBy}"
				class="${classMap({ 'd2l-dropdown-opener': this._hasDropdownItems })}"
				title="${ifDefined(buttonTitle)}"
				type="button">
				<slot @slotchange="${this.#handleDefaultSlotChange}"></slot>${iconView}
			</button><span id="${this._describedById}" hidden>${buttonDescription}</span>${sortedView}`;
		if (this._hasDropdownItems) {
			return html`<d2l-dropdown>
					${button}
					<d2l-dropdown-menu no-pointer align="start" vertical-offset="4">
						<d2l-menu label="${ifDefined(this._label)}" @d2l-table-col-sort-button-item-change="${this._handleTablColSortButtonItemChange}">
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

	_handleSlotChange(e) {
		const items = e.target?.assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);
		const filteredItems = items.filter((item) => {
			return item.tagName === 'D2L-TABLE-COL-SORT-BUTTON-ITEM';
		});
		this._hasDropdownItems = filteredItems.length > 0;
	}

	_handleTablColSortButtonItemChange(e) {
		this._selectedMenuItemText = e.target?.text;
	}

	#handleDefaultSlotChange(e) {
		const labels = e.target?.assignedNodes({ flatten: false })
			.map(node => {
				if (node.nodeType === Node.TEXT_NODE) return node.textContent;
				if (node.nodeType === Node.ELEMENT_NODE) return node.innerText;
			}).filter(text => typeof(text) === 'string' && text.trim().length > 0)
			.map(text => text.replace(/[\t\n\r]+/g, ' ').trim());
		this._label = labels.join(' ');
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);
