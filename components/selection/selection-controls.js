import '../overflow-group/overflow-group.js';
import './selection-select-all.js';
import './selection-select-all-pages.js';
import './selection-summary.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PageableSubscriberMixin } from '../paging/pageable-subscriber-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * Controls for selection components (e.g. list, table-wrapper) containing select-all, etc.
 * @slot - Responsive container using `d2l-overflow-group` for `d2l-selection-action` elements
 */
export class SelectionControls extends PageableSubscriberMixin(SelectionObserverMixin(RtlMixin(LocalizeCoreElement(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Whether to render select-all and selection summary
			 * @type {boolean}
			 */
			noSelection: { type: Boolean, attribute: 'no-selection' },
			/**
			 * ADVANCED: Text to display if no items are selected (overrides pageable counts)
			 * @type {string}
			 */
			noSelectionText: { type: String, attribute: 'no-selection-text' },
			/**
			 * Disables sticky positioning for the controls
			 * @type {boolean}
			 */
			noSticky: { type: Boolean, attribute: 'no-sticky', reflect: true },
			/**
			 * Whether all pages can be selected
			 * @type {boolean}
			 */
			selectAllPagesAllowed: { type: Boolean, attribute: 'select-all-pages-allowed' },
			_hasActions: { state: true },
			_noSelectionText: { state: true },
			_scrolled: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				background-color: var(--d2l-selection-controls-background-color, white);
				display: block;
				position: sticky;
				top: 0;
			}
			:host([no-sticky]) {
				background-color: transparent;
				position: static;
			}
			@media (prefers-reduced-motion: no-preference) {
				.d2l-selection-controls-shadow {
					transition: box-shadow 200ms ease-out;
				}
			}
			:host([_scrolled]) .d2l-selection-controls-shadow {
				background-color: var(--d2l-selection-controls-background-color, white);
				bottom: -4px;
				box-shadow: 0 8px 12px -9px rgba(0, 0, 0, 0.3);
				clip: rect(30px, auto, 200px, auto);
				display: var(--d2l-selection-controls-shadow-display, block);
				height: 40px;
				position: absolute;
				width: 100%;
				z-index: -1;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-selection-controls-container {
				align-items: center;
				display: flex;
				margin-bottom: 6px;
				margin-top: 6px;
				min-height: 54px;
			}
			.d2l-selection-controls-container-slim {
				min-height: 36px;
			}
			d2l-selection-select-all, d2l-selection-summary {
				flex: none;
			}
			d2l-selection-select-all + d2l-selection-summary {
				margin-left: 0.9rem;
			}
			:host([dir="rtl"]) d2l-selection-select-all + d2l-selection-summary {
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
			.d2l-selection-controls-actions {
				--d2l-overflow-group-justify-content: flex-end;
				flex: auto;
				text-align: right;
			}
			:host([dir="rtl"]) .d2l-selection-controls-actions {
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
		const classes = this._getSelectionControlsContainerClasses();
		const label = (this._hasActions || !this.noSelection) ? this._getSelectionControlsLabel() : null;
		return html`
			<div class="d2l-sticky-edge"></div>
			<section class="${classMap(classes)}" aria-label="${ifDefined(label)}">
				${this.noSelection ? nothing : this._renderSelection()}
				<div class="d2l-selection-controls-actions">
					<d2l-overflow-group opener-type="icon"><slot @slotchange="${this._handleSlotChange}"></slot></d2l-overflow-group>
				</div>
			</section>
			${!this.noSticky ? html`<div class="d2l-selection-controls-shadow"></div>` : nothing}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('noSticky')) {
			this._stickyObserverUpdate();
		}
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('noSelectionText') || changedProperties.has('_pageableInfo')) {
			this._noSelectionText = this.noSelectionText || this._getNoSelectionText();
		}
	}

	_getNoSelectionText() {
		if (!this._pageableInfo) return null;
		const { itemShowingCount: count, itemCount: totalCount } = this._pageableInfo;

		return (totalCount === null || count === totalCount)
			? this.localize('components.pageable.info', { count, countFormatted: formatNumber(count) })
			: this.localize('components.pageable.info-with-total', { totalCount, countFormatted: formatNumber(count), totalCountFormatted: formatNumber(totalCount) });
	}

	_getSelectionControlsContainerClasses() {
		return {
			'd2l-selection-controls-container': true,
			'd2l-selection-controls-container-slim': (!this._hasActions && !this.selectAllPagesAllowed)
		};
	}

	_getSelectionControlsLabel() {
		return this.localize('components.selection-controls.label');
	}

	_handleSlotChange(e) {
		this._hasActions = (e.target.assignedNodes({ flatten: true }).filter(node => node.nodeType === Node.ELEMENT_NODE).length > 0);
	}

	_renderSelection() {
		return html`
			${this._provider && !this._noSelectAll ? html`<d2l-selection-select-all></d2l-selection-select-all>` : nothing}
			<d2l-selection-summary no-selection-text="${ifDefined(this._noSelectionText)}"></d2l-selection-summary>
			${this.selectAllPagesAllowed ? html`<d2l-selection-select-all-pages></d2l-selection-select-all-pages>` : nothing}
		`;
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

customElements.define('d2l-selection-controls', SelectionControls);
