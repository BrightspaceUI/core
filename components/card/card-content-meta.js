import '../colors/colors.js';
import { css, html, LitElement } from 'lit';

/**
 * A helper for providing layout/style for meta data within the `content` slot.
 * @slot - Slot for meta data text
 * @typedef {CardContentMeta} CardContentMetaExported
 */
class CardContentMeta extends LitElement {

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				color: var(--d2l-color-tungsten);
				display: inline-block;
				font-size: 0.7rem;
				font-weight: 400;
				line-height: 1rem;
			}
			:host span {
				display: inline-block; /* extra inline-block helps reset display context to opt-out of underline */
			}
		`;
	}

	render() {
		return html`<span><slot></slot></span>`;
	}

}

customElements.define('d2l-card-content-meta', CardContentMeta);
