import '../menu.js';
import { html, LitElement } from 'lit';

class CustomSlots extends LitElement {

	render() {
		return html`
			<d2l-menu>
				<slot></slot>
			</d2l-menu>
		`;
	}

}

customElements.define('d2l-custom-slots', CustomSlots);
