import { css, html, LitElement } from 'lit-element/lit-element.js';

/**
 * A helper for providing layout/style for a title within the `content` slot.
 * @slot - Slot for title text
 */
class CardContentTitle extends LitElement {

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: block;
				font-size: 0.95rem;
				font-weight: 400;
				line-height: 1.4rem;
			}
		`;
	}

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-card-content-title', CardContentTitle);
