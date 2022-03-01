import '../overflow-group/overflow-group.js';
import '../selection/selection-select-all.js';
import '../selection/selection-select-all-pages.js';
import '../selection/selection-summary.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
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
			 * Whether to render select-all and selection summary
			 * @type {boolean}
			 */
			noSelection: { type: Boolean, attribute: 'no-selection' },
			/**
			 * How much padding to render list items with
			 * @type {'normal'|'slim'}
			 */
			paddingType: { type: String, attribute: 'padding-type' },
			/**
			 * Whether all pages can be selected
			 * @type {boolean}
			 */
			selectAllPagesAllowed: { type: Boolean, attribute: 'select-all-pages-allowed' },
			/**
			 * @ignore
			 * Whether to render a header with reduced whitespace
			 * TODO: Remove
			 * @type {boolean}
			 */
			slim: { reflect: true, type: Boolean },
			_sticking: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				background-color: var(--d2l-list-header-background-color, white);
				display: block;
				position: sticky;
				top: 0;
				z-index: 6; /* must be greater than d2l-list-item-active-border */
			}
			.d2l-list-header-shadow {
				transition: box-shadow 200ms ease-out;
			}
			:host([_sticking]) .d2l-list-header-shadow {
				background-color: var(--d2l-list-header-background-color, white);
				bottom: -5px;
				box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.15);
				height: 5px;
				position: absolute;
				width: 100%;
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
			.d2l-list-header-extend-separator {
				padding: 0 0.9rem;
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
			d2l-selection-select-all-pages {
				flex: none;
				margin-left: 0.45rem;
			}
			:host([dir="rtl"]) d2l-selection-select-all-pages {
				margin-left: 0;
				margin-right: 0.45rem;
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
		this.noSelection = false;
		this.paddingType = 'normal';
		this.selectAllPagesAllowed = false;
		this.slim = false;
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (!parent) return;

		this._extendSeparator = parent.hasAttribute('extend-separators');
	}

	render() {
		const classes = {
			'd2l-list-header-container': true,
			'd2l-list-header-extend-separator': this._extendSeparator
		};
		return html`
			<div class="${classMap(classes)}">
				${this.noSelection ? null : html`
					<d2l-selection-select-all></d2l-selection-select-all>
					<d2l-selection-summary
						aria-hidden="true"
						class="d2l-list-header-summary"
						no-selection-text="${this.localize('components.selection.select-all')}">
					</d2l-selection-summary>
					${this.selectAllPagesAllowed ? html`<d2l-selection-select-all-pages></d2l-selection-select-all-pages>` : null}
				`}
				<div class="d2l-list-header-actions">
					<d2l-overflow-group opener-type="icon"><slot></slot></d2l-overflow-group>
				</div>
			</div>
			<div class="d2l-list-header-shadow"></div>
		`;
	}

}

customElements.define('d2l-list-header', ListHeader);
