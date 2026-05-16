import { css, html, LitElement } from 'lit';

/**
 * A container element that can order its contents separately for keyboard users, screenreader users, and visually
 * @slot content - Slot for primary content
 */
class OrderItem extends LitElement {

	static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-order-item', OrderItem);
