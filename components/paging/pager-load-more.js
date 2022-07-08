import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, LitElement } from 'lit';
import { buttonStyles } from '../button/button-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

const nativeFocus = document.createElement('div').focus;

/**
 *  A pager component for load-more paging.
 * @fires d2l-pager-load-more - Dispatched when the user clicks the load-more button. Consumers must call the provided "complete" method once items have been loaded.
 */
class LoadMore extends FocusMixin(FocusVisiblePolyfillMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			/**
			 * Whether there are more items that can be loaded
			 * @type {boolean}
			 */
			hasMore: { type: Boolean, attribute: 'has-more' },
			/**
			 * Total number of items
			 * @type {number}
			 */
			itemCount: { type: Number, attribute: 'item-count' },
			/**
			 * The number of additional items if more items can be loaded
			 * @type {number}
			 */
			pageSize: { type: Number, attribute: 'page-size' },
			/**
			 * The number of items showing. Assigned by PageableMixin.
			 * @ignore
			 */
			itemShowingCount: { type: Number },
			_loading: { state: true }
		};
	}

	static get styles() {
		return [ buttonStyles, labelStyles, css`
			:host {
				display: block;
			}
			:host(:not([has-more])),
			:host([hidden]) {
				display: none;
			}
			button {
				align-items: center;
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-sylvite);
				display: flex;
				gap: 0.5rem;
				justify-content: center;
				width: 100%;
			}
			button:hover {
				background-color: var(--d2l-color-sylvite);
				border-color: var(--d2l-color-gypsum);
			}
			.action {
				color: var(--d2l-color-celestine);
			}
			.separator {
				border-right: 1px solid var(--d2l-color-mica);
				height: 0.8rem;
			}
			.info {
				color: var(--d2l-color-galena);
				font-weight: 400;
			}
			d2l-loading-spinner {
				display: none;
			}
			.loading > .action,
			.loading > .separator,
			.loading > .info {
				display: none;
			}
			.loading > d2l-loading-spinner {
				display: inline-block;
			}
		`];
	}

	constructor() {
		super();
		this.hasMore = false;
		this.itemCount = -1;
		this.itemShowingCount = 0;
		this.pageSize = 50;
		this._loading = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		if (!this.hasMore) return;
		const classes = {
			'd2l-label-text': true,
			'loading': this._loading
		};
		return html`<button class="${classMap(classes)}" @click="${this._handleClick}">
			<span class="action">${this.localize('components.pager-load-more.action', { count: this.pageSize })}</span>
			${this.itemCount > -1 ? html`
				<span class="separator"></span>
				<span class="info">${this.localize('components.pager-load-more.info', { showingCount: this.itemShowingCount, totalCount: this.itemCount })}</span>
			` : null}
			<d2l-loading-spinner size="24"></d2l-loading-spinner>
		</button>`;
	}

	async _handleClick() {
		const pageable = findComposedAncestor(this, node => node._pageable);
		const lastItemIndex = pageable._getLastItemIndex();

		await new Promise(resolve => {
			this._loading = true;
			this.dispatchEvent(new CustomEvent('d2l-pager-load-more', {
				bubbles: false,
				composed: false,
				detail: { complete: resolve }
			}));
		});
		this._loading = false;

		const item = pageable._getItemByIndex(lastItemIndex + 1);

		if (!item) return;
		if (item.updateComplete) await item.updateComplete;

		if (item.focus !== nativeFocus) {
			requestAnimationFrame(() => {
				item.focus();
			});
		} else {
			const firstFocusable = getFirstFocusableDescendant(this);
			if (firstFocusable) firstFocusable.focus();
		}
	}

}

customElements.define('d2l-pager-load-more', LoadMore);
