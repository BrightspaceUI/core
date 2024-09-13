import './order-item.js';
import { css, html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A container element that can order its contents separately for keyboard users, screenreader users, and visually.
 * @slot content - Slot for primary content
 */
class Order extends LitElement {

	static get properties() {
		return {
			/**
			 * Specifies the order in which elements should be navigable by keyboard.
			 * This should almost never be set, allowing keyboard order to match the visual order.
			 * @type {array}
			 * @default {visualOrder}
			 */
			keyboardOrder: { type: Array, attribute: 'keyboard-order' },
			/**
			 * Specifies the order in which elements should appear visually
			 * @type {array}
			 */
			visualOrder: { type: Array, attribute: 'visual-order' },
		};
	}

	static get styles() {
		return css`
			:host {
				display: flex;
				align-items: center;
			}
		`;
	}

	constructor() {
		super();
		this.visualOrder = Array(this.childElementCount).fill(0).map((_, idx) => idx + 1);
	}

	render() {
		return html`
			${[...this.children].map((child, idx) => {

				child.slot = `item-${idx + 1}`;
				const styles = { order: this.visualOrder[idx] ?? idx };
				const tabindex = child.focus && (this.keyboardOrder?.[idx] ?? this.visualOrder[idx]);

				return html`
					<d2l-order-item
						tabindex="${tabindex ?? idx}"
						style="${styleMap(styles)}">
							<slot @slotchange="${this.#handleSlotChangeRemove}" name="item-${idx + 1}"></slot>
					</d2l-order-item>
				`;
			})}
			<slot @slotchange="${this.#handleSlotChangeAdd}"></slot>
		`;
	}

	#handleSlotChangeAdd(e) {
		if (e.target.assignedElements().length) this.requestUpdate();
	}

	#handleSlotChangeRemove(e) {
		if (!e.target.assignedElements().length) this.requestUpdate();
	}

}

customElements.define('d2l-order', Order);
