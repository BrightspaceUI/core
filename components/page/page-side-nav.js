import { html, LitElement } from 'lit';
import { PagePanelMixin, pagePanelStyles } from './page-panel-mixin.js';
import { getScrollableAncestor } from '../../helpers/dom.js';

/**
 * Component to be placed in the side-nav slot of d2l-page, providing a panel with optional header
 * @slot - The main content of the side-nav page panel
 * @slot header-start - Optional start content of the side-nav page header
 * @slot header-end - Optional end content of the side-nav page header
 */
class PageSideNav extends PagePanelMixin(LitElement) {

	static styles = [pagePanelStyles];

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('focusin', this.#handleFocusin);
		this.addEventListener('d2l-list-item-focusin', this.#handleFocusin);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('focusin', this.#handleFocusin);
		this.removeEventListener('d2l-list-item-focusin', this.#handleFocusin);
	}

	render() {
		return this._renderPanel(html`<slot></slot>`);
	}

	#handleFocusin = (event) => {
		event.stopPropagation();
		const scrollableAncestor = getScrollableAncestor(event.target);
		if (!this._hasHeader || !scrollableAncestor) return;
		const header = this.shadowRoot.querySelector('.panel-header');
		const gap = event.target.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
		if (gap < 0) {
			scrollableAncestor.scrollTo({ top: scrollableAncestor.scrollTop + gap - event.target.offsetHeight / 2, behavior: 'smooth' });
		}
	};
}

customElements.define('d2l-page-side-nav', PageSideNav);
