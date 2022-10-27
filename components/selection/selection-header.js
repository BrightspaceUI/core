import '../overflow-group/overflow-group.js';
import './selection-select-all.js';
import './selection-select-all-pages.js';
import './selection-summary.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A header for list components containing select-all, etc.
 * @slot - Responsive container using `d2l-overflow-group` for `d2l-selection-action` elements
 */
export class SelectionHeader extends RtlMixin(LocalizeCoreElement(LitElement)) {

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
				background-color: var(--d2l-list-header-background-color, white);
				display: block;
				position: sticky;
				top: 0;
				z-index: 6; /* must be greater than d2l-list-item-active-border */
			}
			:host([no-sticky]) {
				background-color: transparent;
				position: static;
				z-index: auto;
			}
			.d2l-list-header-shadow {
				transition: box-shadow 200ms ease-out;
			}
			:host([_scrolled]) .d2l-list-header-shadow {
				background-color: var(--d2l-list-header-background-color, white);
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
			.d2l-list-header-container {
				align-items: center;
				display: flex;
				margin-bottom: 6px;
				margin-top: 6px;
				min-height: 54px;
			}
			.d2l-list-header-container-slim {
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
		this.noSticky = false;
		this.selectAllPagesAllowed = false;
		this._extendSeparator = false;
		this._scrolled = false;
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (!parent) return;

		this._extendSeparator = parent.hasAttribute('extend-separators');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._stickyObserverDisconnect();
	}

	render() {
		const classes = {
			'd2l-list-header-container': true,
			'd2l-list-header-container-slim': (!this._hasActions && !this.selectAllPagesAllowed),
			'd2l-list-header-extend-separator': this._extendSeparator
		};
		return html`
			<div class="d2l-sticky-edge"></div>
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
					<d2l-overflow-group opener-type="icon"><slot @slotchange="${this._handleSlotChange}"></slot></d2l-overflow-group>
				</div>
			</div>
			${!this.noSticky ? html`<div class="d2l-list-header-shadow"></div>` : null}
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('noSticky')) {
			this._stickyObserverUpdate();
		}
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
			const rootMargin = '-1px 0px 0px 0px';

			this._stickyIntersectionObserver = new IntersectionObserver(([e]) => {
				this._scrolled = !e.isIntersecting;
			}, { threshold: 1, rootMargin });

			const target = this.shadowRoot.querySelector('.d2l-sticky-edge');
			this._stickyIntersectionObserver.observe(target);
		}
	}

}

customElements.define('d2l-selection-header', SelectionHeader);
