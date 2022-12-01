import '../overflow-group/overflow-group.js';
import './selection-select-all.js';
import './selection-select-all-pages.js';
import './selection-summary.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A header for selection components (e.g. list, table-wrapper) containing select-all, etc.
 * @slot - Responsive container using `d2l-overflow-group` for `d2l-selection-action` elements
 */
export class SelectionHeader extends SelectionObserverMixin(RtlMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			/**
			 * Whether to render select-all and selection summary
			 * @type {boolean}
			 */
			noSelection: { type: Boolean, attribute: 'no-selection' },
			/**
			 * Disables sticky positioning for the header
			 * @type {boolean}
			 */
			noSticky: { type: Boolean, attribute: 'no-sticky' },
			/**
			 * Whether all pages can be selected
			 * @type {boolean}
			 */
			selectAllPagesAllowed: { type: Boolean, attribute: 'select-all-pages-allowed' },
			_hasActions: { state: true },
			_scrolled: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				background-color: var(--d2l-selection-header-background-color, white);
				display: block;
				position: sticky;
				top: 0;
			}
			:host([no-sticky]) {
				background-color: transparent;
				position: static;
			}
			@media (prefers-reduced-motion: no-preference) {
				.d2l-selection-header-shadow {
					transition: box-shadow 200ms ease-out;
				}
			}
			:host([_scrolled]) .d2l-selection-header-shadow {
				background-color: var(--d2l-selection-header-background-color, white);
				bottom: -4px;
				box-shadow: 0 8px 12px -9px rgba(0, 0, 0, 0.3);
				clip: rect(30px, auto, 200px, auto);
				height: 40px;
				position: absolute;
				width: 100%;
				z-index: -1;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-selection-header-container {
				align-items: center;
				display: flex;
				margin-bottom: 6px;
				margin-top: 6px;
				min-height: 54px;
			}
			.d2l-selection-header-container-slim {
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
			d2l-selection-select-all-pages {
				flex: none;
				margin-left: 0.45rem;
			}
			:host([dir="rtl"]) d2l-selection-select-all-pages {
				margin-left: 0;
				margin-right: 0.45rem;
			}
			.d2l-selection-header-actions {
				--d2l-overflow-group-justify-content: flex-end;
				flex: auto;
				text-align: right;
			}
			:host([dir="rtl"]) .d2l-selection-header-actions {
				text-align: left;
			}
			.d2l-sticky-edge {
				left: 0;
				position: absolute;
				right: 0;
				top: -1px;
			}
		`;
	}

	constructor() {
		super();
		this.noSelection = false;
		this.noSticky = false;
		this.selectAllPagesAllowed = false;
		this._scrolled = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._stickyObserverDisconnect();
	}

	render() {
		const classes = this._getSelectionHeaderContainerClasses();
		const label = this._getSelectionHeaderLabel();
		return html`
			<div class="d2l-sticky-edge"></div>
			<section class="${classMap(classes)}" aria-label="${label}">
				${this.noSelection ? null : html`
					<d2l-selection-select-all></d2l-selection-select-all>
					<d2l-selection-summary
						aria-hidden="true"
						no-selection-text="${this.localize('components.selection.select-all')}"
					>
					</d2l-selection-summary>
					${this.selectAllPagesAllowed ? html`<d2l-selection-select-all-pages></d2l-selection-select-all-pages>` : null}
				`}
				<div class="d2l-selection-header-actions">
					<d2l-overflow-group opener-type="icon"><slot @slotchange="${this._handleSlotChange}"></slot></d2l-overflow-group>
				</div>
			</section>
			${!this.noSticky ? html`<div class="d2l-selection-header-shadow"></div>` : null}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('noSticky')) {
			this._stickyObserverUpdate();
		}
	}

	_getSelectionHeaderContainerClasses() {
		return {
			'd2l-selection-header-container': true,
			'd2l-selection-header-container-slim': (!this._hasActions && !this.selectAllPagesAllowed)
		};
	}

	_getSelectionHeaderLabel() {
		return this.localize('components.selection-header.label');
	}

	_handleSlotChange(e) {
		this._hasActions = (e.target.assignedNodes({ flatten: true }).filter(node => node.nodeType === Node.ELEMENT_NODE).length > 0);
	}

	_stickyObserverDisconnect() {
		if (this._stickyIntersectionObserver) {
			this._stickyIntersectionObserver.disconnect();
			this._stickyIntersectionObserver = undefined;
			this._scrolled = false;
		}
	}

	_stickyObserverUpdate() {
		this._stickyObserverDisconnect();

		if (!this.noSticky && typeof(IntersectionObserver) === 'function') {
			this._stickyIntersectionObserver = new IntersectionObserver(([e]) => {
				this._scrolled = !e.isIntersecting;
			});

			const target = this.shadowRoot.querySelector('.d2l-sticky-edge');
			this._stickyIntersectionObserver.observe(target);
		}
	}

}

customElements.define('d2l-selection-header', SelectionHeader);
