import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
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
			}
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-table-col-sort-button-additional-padding-inline-end: 0px; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-col-sort-button-additional-padding-inline-start: 0px; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-col-sort-button-justify-content: unset;
				--d2l-table-col-sort-button-width: calc(100% - var(--d2l-table-cell-col-sort-button-size-offset, 4px));
			}
			:host([nosort]) {
				--d2l-table-col-sort-button-additional-padding-inline-end: calc(0.6rem + 18px);
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
				justify-content: var(--d2l-table-col-sort-button-justify-content);
				letter-spacing: inherit;
				line-height: 0.9rem;
				margin-block: 0 var(--d2l-table-cell-col-sort-button-size-offset, 4px);
				margin-inline: 0 var(--d2l-table-cell-col-sort-button-size-offset, 4px);
				padding: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset, 4px));
				padding-inline-end: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset, 4px) + var(--d2l-table-col-sort-button-additional-padding-inline-end));
				padding-inline-start: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset, 4px) + var(--d2l-table-col-sort-button-additional-padding-inline-start));
				text-decoration: none;
				width: var(--d2l-table-col-sort-button-width);
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
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const buttonDescription = this.nosort ? this.localize('components.table-col-sort-button.addSortOrder') : this.localize('components.table-col-sort-button.changeSortOrder');
		const buttonTitle = this.nosort
			? undefined
			: this.localize('components.table-col-sort-button.title', {
				sourceType: this.sourceType,
				direction: this.desc ? 'desc' : undefined
			});

		const iconView = !this.nosort ?
			html`<d2l-icon icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}"></d2l-icon>` :
			null;

		return html`<button
				aria-describedby="${this._describedById}"
				title="${ifDefined(buttonTitle)}"
				type="button">
				<slot></slot>${iconView}
			</button><span id="${this._describedById}" hidden>${buttonDescription}</span>`;
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);
