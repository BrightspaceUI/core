import '../order.js';
import '../../button/button.js';
import { css, html, LitElement } from 'lit';

/**
 * A container element that can order its contents separately for keyboard users, screenreader users, and visually
 * @slot content - Slot for primary content
 */
class OrderDemo extends LitElement {

	static get properties() {
		return {
			num: { type: Number },
			visualOrder: { type: String, attribute: 'visual-order' },
			keyboardOrder: { type: String, attribute: 'keyboard-order' },
			extra: { type: Boolean }
		}
	}

	render() {
		debugger;
		return html`<d2l-order style="gap: 0.5rem;" visual-order="${this.visualOrder}" keyboard-order="${this.keyboardOrder}">
			${Array(this.num).fill(0).map((item, idx) => {
				return html`<d2l-button>${idx + 1}</d2l-button>`
			})}
			${this.extra ? html`<d2l-button>Extra Button</d2l-button>` : null}
		</d2l-order>`;
	}

}

customElements.define('d2l-order-demo', OrderDemo);
