import '../button/button.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus-mixin.js';

/**
 *  A pager component for load-more paging.
 * @fires d2l-pager-load-more-load - Dispatched when the user clicks the load-more button. Consumers must call the provided "complete" method once items have been loaded.
 */
class LoadMore extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * The number of additional items if more items can be loaded
			 * @type {boolean}
			 */
			count: { type: Number },
			/**
			 * Whether there are more items that can be loaded
			 * @type {boolean}
			 */
			hasMore: { type: Boolean, attribute: 'has-more' },
			_loading: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host(:not([has-more])),
			:host([hidden]) {
				display: none;
			}
			d2l-button {
				width: 100%;
			}
		`;
	}

	constructor() {
		super();
		this.count = -1;
		this.hasMore = false;
		this._loading = false;
	}

	static get focusElementSelector() {
		return 'd2l-button';
	}

	render() {
		if (!this.hasMore) return;
		if (this._loading) {
			return html`<d2l-loading-spinner></d2l-loading-spinner>`;
		} else {
			const loadMoreText = (this.count > 0 ? `Load More (${this.count})` : 'Load More');
			return html`<d2l-button @click="${this._handleClick}">${loadMoreText}</d2l-button>`;
		}
	}

	async _handleClick() {
		await new Promise(resolve => {
			this._loading = true;
			this.dispatchEvent(new CustomEvent('d2l-pager-load-more-load', {
				bubbles: true,
				composed: false,
				detail: { complete: resolve }
			}));
		});
		this._loading = false;
	}

}

customElements.define('d2l-pager-load-more', LoadMore);
