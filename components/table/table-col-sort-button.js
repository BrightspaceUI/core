import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';

/**
 * Button for sorting a table column in ascending/descending order.
 * @slot - Text of the sort button
 */
export class TableColSortButton extends FocusMixin(LitElement) {

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
			 * Show the different sort options available.
			 * @type {String}
			 */
			sortOptions: {
				reflect: true,
				type: String
			}
		};
	}

	static get styles() {
		return css`
			button {
				align-items: center;
				background-color: transparent;
				border: none;
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				font-weight: bold;
				letter-spacing: inherit;
				margin: 0;
				padding: 0;
				text-decoration: none;
			}
			button::-moz-focus-inner {
				border: 0;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:hover {
				text-decoration: underline;
			}
			button:focus-visible,
			button:${unsafeCSS(getFocusPseudoClass())} {
				border-radius: 0.2rem;
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				outline-style: none;
			}
		`;
	}

	constructor() {
		super();
		this.nosort = false;
		this.desc = false;
		this.sortOptions = "";
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const iconView = !this.nosort ?
			html`<d2l-icon icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}">
				</d2l-icon>`
			: null;
		return this.sortOptions.length > 1 ?
				html`<d2l-dropdown>
						<button class="d2l-dropdown-opener" type="button"><slot></slot>${iconView}</button>
						<d2l-dropdown-content>
							<d2l-list>
								${this.sortOptions.split(",").forEach(option => {
									return html`
										<d2l-list-item>
											<d2l-list-item-content>
												<div>${option}</div>
											</d2l-list-item-content>
										</d2l-list-item>
									`
								})}
							</d2l-list>
						</d2l-dropdown-content>
					</d2l-dropdown>`
				:
				html`<button type="button"><slot></slot>${iconView}</button>`;
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);
