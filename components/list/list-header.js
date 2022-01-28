import '../overflow-group/overflow-group.js';
import '../selection/selection-select-all.js';
import '../selection/selection-summary.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A header for list components containing select-all, etc.
 * @slot - Responsive container using `d2l-overflow-group` for `d2l-selection-action` elements
 */
class ListHeader extends RtlMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * @ignore
			 * Whether to render a header with reduced whitespace
			 * TODO: Remove
			 * @type {boolean}
			 */
			slim: { reflect: true, type: Boolean },
			/**
			 * How much padding to render list items with
			 * @type {'normal'|'slim'}
			 */
			paddingType: { type: String, attribute: 'padding-type' },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-list-header-container {
				align-items: center;
				display: flex;
				margin-bottom: 6px;
				margin-top: 6px;
				min-height: 58px;
			}
			:host([slim]) .d2l-list-header-container { /* TODO: Remove */
				min-height: 36px;
			}
			:host([padding-type="slim"]) .d2l-list-header-container {
				min-height: 36px;
			}
			d2l-selection-select-all {
				flex: none;
			}
			d2l-selection-summary {
				flex: none;
				margin-left: 0.9rem;
			}
			:host([dir="rtl"]) d2l-selection-summary {
				margin-left: 0;
				margin-right: 0.9rem;
			}
			.d2l-list-header-actions {
				--d2l-overflow-group-justify-content: flex-end;
				flex: auto;
				text-align: right;
			}
			:host([dir="rtl"]) .d2l-list-header-actions {
				text-align: left;
			}
		`;
	}

	constructor() {
		super();
		this.slim = false;
		this.paddingType = 'normal';
	}

	render() {
		return html`
			<div class="d2l-list-header-container">
				<d2l-selection-select-all></d2l-selection-select-all>
				<d2l-selection-summary
					aria-hidden="true"
					class="d2l-list-header-summary"
					no-selection-text="${this.localize('components.selection.select-all')}">
				</d2l-selection-summary>
				<div class="d2l-list-header-actions">
					<d2l-overflow-group opener-type="icon"><slot></slot></d2l-overflow-group>
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-list-header', ListHeader);
