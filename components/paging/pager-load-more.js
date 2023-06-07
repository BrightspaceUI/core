import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, LitElement, nothing } from 'lit';
import { buttonStyles } from '../button/button-styles.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getSeparator } from '@brightspace-ui/intl/lib/list.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { PageableSubscriberMixin } from './pageable-subscriber-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

const nativeFocus = document.createElement('div').focus;

/**
 *  A pager component for load-more paging.
 * @fires d2l-pager-load-more - Dispatched when the user clicks the load-more button. Consumers must call the provided "complete" method once items have been loaded.
 */
class LoadMore extends PageableSubscriberMixin(FocusMixin(LocalizeCoreElement(RtlMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Whether there are more items that can be loaded.
			 * @type {boolean}
			 */
			hasMore: { type: Boolean, attribute: 'has-more', reflect: true },
			/**
			 * The number of additional items to load.
			 * @type {number}
			 */
			pageSize: { type: Number, attribute: 'page-size', reflect: true },
			_loading: { state: true }
		};
	}

	static get styles() {
		return [ buttonStyles, labelStyles, offscreenStyles, css`
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
				font-family: inherit;
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
		`];
	}

	constructor() {
		super();
		this.hasMore = false;

		/** @ignore */
		this._loading = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		if (!this.hasMore || !this._pageableInfo) return nothing;
		const { itemCount, itemShowingCount } = this._pageableInfo;

		return html`
			${this._loading ? html`
				<span class="d2l-offscreen" role="alert">${this.localize('components.pager-load-more.status-loading')}</span>
			` : nothing}
			<button class="d2l-label-text" @click="${this._handleClick}" type="button">
			${this._loading ? html`
				<d2l-loading-spinner size="24"></d2l-loading-spinner>
			` : html`
				<span class="action">${isNaN(this.pageSize) ? this.localize('components.pager-load-more.action') : this.localize('components.pager-load-more-with-page-size.action', { count: formatNumber(this.pageSize) })}</span>
				${itemCount !== null ? html`
					<span class="d2l-offscreen">${getSeparator({ nonBreaking: true })}</span>
					<span class="separator"></span>
					<span class="info">${this.localize('components.pageable.info-with-total', { countFormatted: formatNumber(itemShowingCount), totalCount: itemCount, totalCountFormatted: formatNumber(itemCount) })}</span>
				` : nothing}
			`}
		</button>
		`;
	}

	async _handleClick() {
		if (this._loading) return;
		const pageable = this._getPageableRegistries()[0];
		if (!pageable) return;
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
			requestAnimationFrame(() => item.focus());
		} else {
			const firstFocusable = getFirstFocusableDescendant(item);
			if (firstFocusable) firstFocusable.focus();
		}
	}

}

customElements.define('d2l-pager-load-more', LoadMore);
