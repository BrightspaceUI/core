import '../overflow-group/overflow-group.js';
import '../selection/selection-select-all.js';
import '../selection/selection-select-all-pages.js';
import '../selection/selection-summary.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SelectionObserverMixin } from '../selection/selection-observer-mixin.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A header for list components containing select-all, etc.
 * @slot - Responsive container using `d2l-overflow-group` for `d2l-selection-action` elements
 */
class ListHeader extends SelectionObserverMixin(RtlMixin(LocalizeCoreElement(LitElement))) {

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
			 * Whether selection is required to show the bulk-action header
			 * @type {boolean}
			 */
			requiresSelection: { type: Boolean, attribute: 'requires-selection', reflect: true },
			/**
			 * Whether all pages can be selected
			 * @type {boolean}
			 */
			selectAllPagesAllowed: { type: Boolean, attribute: 'select-all-pages-allowed' },
			_hasActions: { state: true },
			_scrolled: { type: Boolean, reflect: true },
			_state: { state: true }
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
			:host([requires-selection]) .d2l-list-header-container {
				display: none;
				max-height: 0;
				opacity: 0;
				/* transform: translate(0, -10px); */
				transition: opacity 100ms linear, max-height 100ms linear;
			}
			:host([requires-selection]) .d2l-list-header-container-pre-showing,
			:host([requires-selection]) .d2l-list-header-container-hiding {
				display: block;
			}
			:host([requires-selection]) .d2l-list-header-container-showing {
				display: block;
				max-height: 70px;
				opacity: 1;
				/* transform: translate(0, 0); */
			}

			.d2l-list-header-container-inner {
				align-items: center;
				display: flex;
				margin-bottom: 6px;
				margin-top: 6px;
				min-height: 54px;
			}
			.d2l-list-header-slim {
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
		this._state = 'hidden';
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
			'd2l-list-header-container-pre-showing': (this.requiresSelection && this._state === 'pre-showing'),
			'd2l-list-header-container-showing': (this.requiresSelection && this._state === 'showing'),
			'd2l-list-header-container-hiding': (this._state === 'hiding')
		};
		const classesInner = {
			'd2l-list-header-container-inner': true,
			'd2l-list-header-slim': (!this._hasActions && !this.selectAllPagesAllowed),
			'd2l-list-header-extend-separator': this._extendSeparator
		};
		return html`
			<div class="${classMap(classes)}">
				<div class="${classMap(classesInner)}">
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
			</div>
			${!this.noSticky ? html`<div class="d2l-list-header-shadow"></div>` : null}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!this.requiresSelection || !changedProperties.has('selectionInfo')) return;

		const hasSelection = (this.selectionInfo.state !== 'none');

		if (hasSelection) {
			if (this._state === 'hiding') {
				this._state = 'showing';
			} else if (this._state === 'hidden') {
				if (!reduceMotion) {
					this._state = 'pre-showing';
					// pause before running the opening animation because transitions won't run when changing from 'diplay: none' to 'display: block'
					//this._preopenFrame = requestAnimationFrame(() => {
					//	this._preopenFrame = requestAnimationFrame(() => {
					//		this._state = 'showing';
					//	});
					//});

					// todo: we might want to hide the overflow during the animation... really depends on the animation that Design wants

					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							this._state = 'showing';
						});
					});
				} else {
					this._state = 'showing';
				}
			}
		} else {
			const hide = () => {
				this._state = 'hidden';
				// todo: where should focus go if select-all was unchecked?
			};
			if (reduceMotion || this._state === 'pre-showing') {
				hide();
			} else if (this._state === 'showing') {
				this.shadowRoot.querySelector('.d2l-list-header-container').addEventListener('transitionend', hide, { once: true });
				this._state = 'hiding';
			}

			//if (reduceMotion || this._state === 'pre-showing') {
			//	cancelAnimationFrame(this._preopenFrame);
			//	this._state = 'hidden';
			//} else if (this._state === 'showing') {
			//	this._state = 'hiding';
			//}
		}

	}

	_handleSlotChange(e) {
		this._hasActions = (e.target.assignedNodes({ flatten: true }).filter(node => node.nodeType === Node.ELEMENT_NODE).length > 0);
	}

}

customElements.define('d2l-list-header', ListHeader);
