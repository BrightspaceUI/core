import { css, html, LitElement } from 'lit-element/lit-element.js';

class ListDemoNameImage extends LitElement {

	static get properties() {
		return {
			letters: { type: String },
			color: { type: String }
		};
	}

	static get styles() {
		return [ css`
			svg {
				height: 2.1rem;
				width: 2.1rem;
			}
			.d2l-list-demo-name-image-text {
				fill: white;
				font-size: 12;
			}
		`];
	}

	render() {
		return html`
			<svg viewBox="0 0 42 42">
				<rect x="0" y="0" rx="6" ry="6" width="42" height="42" stroke="none" fill="${this.color}" />
				<text x="21" y="28" text-anchor="middle" class="d2l-list-demo-name-image-text">
					${this.letters}
				</text>
			</svg>
		`;
	}

}

customElements.define('d2l-list-demo-name-image', ListDemoNameImage);
