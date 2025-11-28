import '../more-less.js';
import { css, html, LitElement } from 'lit';

const text = {
	short: 'Short text.',
	long: 'This is a much longer piece of text that will demonstrate the more-less component functionality. It should initially be truncated and then expandable to show the full content when the user clicks "more".'
};

class MoreLessTest extends LitElement {
	static get properties() {
		return {
			text: { type: String },
			margin: { type: Boolean, reflect: true },
			extraItems: { type: Number }
		};
	}
	static get styles() {
		return css`
			button:last-of-type {
				margin-bottom: 2em;
			}
			:host([margin]) .hidden-div {
				margin-bottom: 500px;
			}
		`;
	}

	constructor() {
		super();
		this.text = text.short;
		this.margin = false;
		this.extraItems = 0;
	}

	render() {
		return html`
			<button @click="${this.#toggleText}">Toggle Text Length</button>
			<button @click="${this.#toggleDivMargin}">Toggle Text Margin</button>
			<button @click="${this.#addExtraItem}">Add Extra Item</button>
			<button ?disabled="${this.extraItems === 0}" @click="${this.#removeExtraItem}">Remove Extra Item</button>
			<hr>
			<d2l-more-less>
				${this.text}
				<div class="hidden-div"></div>
				${Array.from({ length: this.extraItems }, (_, i) => html`<div>Extra item ${i + 1}</div>`)}
			</d2l-more-less>
		`;
	}

	#addExtraItem() {
		this.extraItems += 1;
	}

	#removeExtraItem() {
		if (this.extraItems > 0) this.extraItems -= 1;
	}

	#toggleDivMargin() {
		this.margin = !this.margin;
	}

	#toggleText() {
		this.text = this.text === text.short ? text.long : text.short;
	}

}
customElements.define('d2l-more-less-test', MoreLessTest);
